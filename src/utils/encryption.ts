export const encrypt = (text: string, key: string): string => {
    return btoa(
      text
        .split("")
        .map((char, index) =>
          String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length))
        )
        .join("")
    );
  };
  
  export const decrypt = (encryptedText: string, key: string): string => {
    return atob(encryptedText)
      .split("")
      .map((char, index) =>
        String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(index % key.length))
      )
      .join("");
  };