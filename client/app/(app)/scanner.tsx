// app/(app)/scanner.tsx

import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
// FIX: Corrected the casing from BarcodeScanner to BarCodeScanner
import { BarCodeScanner, BarCodeScannerResult } from 'expo-barcode-scanner'; 
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useIsFocused } from '@react-navigation/native';

export default function ScannerScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();
  const isFocused = useIsFocused(); // This hook is true when the screen is focused

  useEffect(() => {
    const getPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    };

    getPermissions();
  }, []);

  const handleBarCodeScanned = (scanningResult: BarCodeScannerResult) => {
    const { data } = scanningResult;
    setScanned(true);
    try {
      const parsedData = JSON.parse(data);
      const { receiver, amount } = parsedData;

      if (receiver && amount) {
        router.replace({
          pathname: '/(app)/add-payment',
          params: { receiver, amount: String(amount) },
        });
      } else {
        Alert.alert('Invalid QR Code', 'The scanned QR code is missing the required receiver or amount information.', [{ text: 'OK', onPress: () => setScanned(false) }]);
      }
    } catch (e) {
      Alert.alert('Invalid Data', `The QR code data could not be processed: ${data}`, [{ text: 'OK', onPress: () => setScanned(false) }]);
    }
  };

  const pickImage = async () => {
    if (!hasGalleryPermission) {
        alert('Permission to access gallery is required!');
        return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      try {
        // FIX: Corrected the casing from BarcodeScanner to BarCodeScanner
        const scannedResults = await BarCodeScanner.scanFromURLAsync(result.assets[0].uri);
        if (scannedResults.length > 0) {
          handleBarCodeScanned(scannedResults[0]);
        } else {
          Alert.alert('No QR Code Found', 'We could not find a QR code in the selected image.', [{ text: 'OK' }]);
        }
      } catch (error) {
          console.error("Error scanning image:", error);
          Alert.alert('Scan Error', 'There was an error scanning the selected image.');
      }
    }
  };

  if (hasCameraPermission === null) {
    return <View style={styles.permissionContainer}><Text style={styles.permissionText}>Requesting camera permission...</Text></View>;
  }
  if (hasCameraPermission === false) {
    return <View style={styles.permissionContainer}><Text style={styles.permissionText}>No access to camera. Please enable it in your settings.</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Only render the CameraView when the screen is focused */}
      {isFocused && (
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Scan a payment QR code</Text>
        <View style={styles.scannerBox} />
        <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color={Colors.primary} />
            <Text style={styles.uploadButtonText}>Upload from Gallery</Text>
        </TouchableOpacity>
      </View>
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    permissionText: { fontSize: 18, textAlign: 'center' },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlayText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        position: 'absolute',
        top: 100,
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 8,
        borderRadius: 5,
    },
    scannerBox: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#fff',
        borderRadius: 10,
    },
    uploadButton: {
        position: 'absolute',
        bottom: 50,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        gap: 10,
    },
    uploadButtonText: {
        color: Colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
