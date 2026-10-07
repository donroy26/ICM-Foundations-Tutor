/* Dependency-free ZIP writer (STORE method, no compression) so the player can
   download their simulated workspace as real files. */

FC.zip = (function () {
  var U = FC.util;

  // CRC32 over uncompressed bytes — table built once.
  var CRC_TABLE = (function () {
    var table = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) {
      c = CRC_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function dosDateTime(d) {
    var time = ((d.getHours() & 0x1F) << 11) | ((d.getMinutes() & 0x3F) << 5) | ((d.getSeconds() / 2) & 0x1F);
    var date = (((d.getFullYear() - 1980) & 0x7F) << 9) | (((d.getMonth() + 1) & 0xF) << 5) | (d.getDate() & 0x1F);
    return { time: time, date: date };
  }

  function u16(v) { return [v & 0xFF, (v >>> 8) & 0xFF]; }
  function u32(v) { return [v & 0xFF, (v >>> 8) & 0xFF, (v >>> 16) & 0xFF, (v >>> 24) & 0xFF]; }

  // entries: [{name: "path/in/zip.md", content: "utf-8 string"}]
  function build(entries) {
    var enc = new TextEncoder();
    var now = dosDateTime(new Date());
    var chunks = [];
    var central = [];
    var offset = 0;

    entries.forEach(function (entry) {
      var nameBytes = enc.encode(entry.name);
      var dataBytes = enc.encode(entry.content);
      var crc = crc32(dataBytes);
      var flags = 0x0800; // bit 11: UTF-8 names

      var local = [].concat(
        u32(0x04034b50), u16(20), u16(flags), u16(0), // STORE
        u16(now.time), u16(now.date),
        u32(crc), u32(dataBytes.length), u32(dataBytes.length),
        u16(nameBytes.length), u16(0)
      );
      chunks.push(new Uint8Array(local), nameBytes, dataBytes);

      central.push({
        nameBytes: nameBytes, crc: crc, size: dataBytes.length,
        flags: flags, time: now.time, date: now.date, offset: offset
      });
      offset += local.length + nameBytes.length + dataBytes.length;
    });

    var centralStart = offset;
    var centralSize = 0;
    central.forEach(function (c) {
      var rec = [].concat(
        u32(0x02014b50), u16(20), u16(20), u16(c.flags), u16(0),
        u16(c.time), u16(c.date),
        u32(c.crc), u32(c.size), u32(c.size),
        u16(c.nameBytes.length), u16(0), u16(0), u16(0), u16(0),
        u32(0), u32(c.offset)
      );
      chunks.push(new Uint8Array(rec), c.nameBytes);
      centralSize += rec.length + c.nameBytes.length;
    });

    var end = [].concat(
      u32(0x06054b50), u16(0), u16(0),
      u16(central.length), u16(central.length),
      u32(centralSize), u32(centralStart), u16(0)
    );
    chunks.push(new Uint8Array(end));

    return new Blob(chunks, { type: "application/zip" });
  }

  // Zip the whole simulated tree and download it.
  function downloadWorkspace() {
    var entries = [];
    FC.vfs.walkFiles(function (path, content) {
      entries.push({ name: path, content: content });
    });
    if (!entries.length) {
      entries.push({
        name: "README.txt",
        content: "Your workspace is empty so far. Play through the first lessons to build your first files.\n"
      });
    }
    var name = (FC.state.data.player.workspaceName || "foundation-workspace") + ".zip";
    U.download(name, build(entries));
    FC.xp.award("packed-up");
  }

  return { build: build, downloadWorkspace: downloadWorkspace, _crc32: crc32 };
})();
