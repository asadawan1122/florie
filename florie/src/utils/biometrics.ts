import SecureStoreHandler from './secureStoreHandler'
import * as Keychain from 'react-native-keychain'
import { BIOMETRY_TYPE } from 'react-native-keychain'
import DeviceInfo from 'react-native-device-info'
import { Platform } from 'react-native'

export const TOUCH_ID = 'TouchID'
export const PASSCODE = 'Passcode'
export const FACE_ID = 'FaceID'

export const getBiometricType = async () => {
    try {
        const biometryType = await Keychain.getSupportedBiometryType()
        let supportedBiometryType: BIOMETRY_TYPE | string | null = biometryType
        return supportedBiometryType
    } catch (error) {
        console.log(error)
    }
}


export const setSupportedBiometricType = async () => {
    try {
        const biometryType = await Keychain.getSupportedBiometryType()
        let supportedBiometryType: BIOMETRY_TYPE | string | null = biometryType
        if (biometryType === BIOMETRY_TYPE.TOUCH_ID || biometryType === BIOMETRY_TYPE.FINGERPRINT) {
            supportedBiometryType = TOUCH_ID
        } else if (biometryType === BIOMETRY_TYPE.FACE_ID || biometryType === BIOMETRY_TYPE.FACE || biometryType === BIOMETRY_TYPE.IRIS) {
            supportedBiometryType = FACE_ID
        } else {
            const isPinOrFingerprintSet = await DeviceInfo.isPinOrFingerprintSet()
            if (isPinOrFingerprintSet && Platform.OS === 'ios') {
                supportedBiometryType = PASSCODE
            } else {
                supportedBiometryType = null
            }
        }
        console.log('supported biometrics type:', supportedBiometryType)
        await SecureStoreHandler.saveSupportedBiometrics(supportedBiometryType)
    } catch (error) {
        console.log(error)
    }
}

export const checkBiometricsEnabled = async () => {
    const biometricsSettings = await SecureStoreHandler.loadBiometricsSettings()
    console.log('biometrics settings', biometricsSettings)
    if (!biometricsSettings) {
        return false
    } else {
        const biometryType = biometricsSettings.biometryType
        if (biometryType) {
            return true
        }
        return false
    }
}
