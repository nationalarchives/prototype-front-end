const hexString: (buffer: ArrayBuffer) => string = buffer => {
  const byteArray = new Uint8Array(buffer);

  const hexCodes = [...byteArray].map(value => {
    const hexCode = value.toString(16);
    const paddedHexCode = hexCode.padStart(2, "0");
    return paddedHexCode;
  });

  return hexCodes.join("");
};

export const generateHash: (file: File) => Promise<string> = file => {
  const crypto = window.crypto.subtle;
  const fileReader: FileReader = new FileReader();
  fileReader.readAsArrayBuffer(file);
  return new Promise<string>(resolve => {
    fileReader.onload = async function() {
      const fileReaderResult: string | ArrayBuffer | null = fileReader.result;
      if (fileReaderResult instanceof ArrayBuffer) {
        const buffer: ArrayBuffer = await crypto.digest(
          "SHA-256",
          fileReaderResult
        );
        resolve(hexString(buffer));
      }
    };
  });
};
