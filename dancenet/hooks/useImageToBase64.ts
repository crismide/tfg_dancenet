import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system'; // For Expo projects
// OR
// import RNFS from 'react-native-fs'; // For non-Expo projects

const useImageToBase64 = (imagePath: any): string | null => {
  const [base64, setBase64] = useState<string | null>(null);

  useEffect(() => {
    const convertImageToBase64 = async () => {
      try {
        // For Expo projects
        const base64String = await FileSystem.readAsStringAsync(imagePath, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setBase64(`data:image/png;base64,${base64String}`);

        // For non-Expo projects
        // const base64String = await RNFS.readFile(imagePath, 'base64');
        // setBase64(`data:image/png;base64,${base64String}`);
      } catch (err) {
        console.error('Error converting image to base64:', err);
      }
    };

    convertImageToBase64();
  }, [imagePath]);

  return base64;
};

export default useImageToBase64;