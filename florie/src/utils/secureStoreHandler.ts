import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import * as Keychain from 'react-native-keychain'
import { PASSCODE } from './biometrics'

export default class SecureStoreHandler {
    //USERNAME and PASSWORD

    static getKeychainOptions = async () => {
        let accessControl = Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE
        const authenticationPrompt = { title: Platform.OS === 'ios' ? '' : ' ' }
        const biometryType = await SecureStoreHandler.loadSupportedBiometrics()
        if (biometryType === PASSCODE) {
            accessControl = Keychain.ACCESS_CONTROL.DEVICE_PASSCODE
        }
        return {
            authenticationPrompt: authenticationPrompt,
            accessControl: accessControl,
            authenticationType: Keychain.AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
            accessible: Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
            storage: Keychain.STORAGE_TYPE.RSA,
            service: 'fakeService'
        }
    }

    static loadHasCredentials = async () => {
        const value = await AsyncStorage.getItem('hasCredentials') ?? 'false'
        console.log('hasCredentials', JSON.parse(value))
        return (JSON.parse(value) ?? false)
    }

    static saveHasCredentials = async (hasCredentials?: boolean) => {
        await AsyncStorage.setItem('hasCredentials', JSON.stringify(hasCredentials ?? false))
    }

    static saveCredentials = async (username: string = '', password: string) => {
        await SecureStoreHandler.saveHasCredentials(true)
        const options = await SecureStoreHandler.getKeychainOptions()
        await Keychain.setGenericPassword(username, password, options)
    
    }

    static getStoredCredentials = async () => {
        try {
            const options = await SecureStoreHandler.getKeychainOptions()
            const credentials = await Keychain.getGenericPassword(options)
            console.log('credentials =>', true)
            if (credentials) {
                console.log('Credentials successfully loaded for user ' + credentials.username)
                return credentials
            } else {
                console.log('No credentials stored')
                return null
            }
        } catch (error) {
            return { error: error }
        }
    }
    
    //BIOMETRICS

    //supported biometrics type: Touch ID / Face ID / passcode

    static loadSupportedBiometrics = async () => {
        const value = await AsyncStorage.getItem('supportedBiometryType') ?? 'null'
        return (JSON.parse(value)?.biometryType ?? null)
    }

    static saveSupportedBiometrics = async (biometryTypeValue: string | null) => {
        if (!biometryTypeValue) {
            await SecureStoreHandler.deleteBiometricsSettings()
            await AsyncStorage.setItem('supportedBiometryType', JSON.stringify(null))
        } else {
            await AsyncStorage.setItem('supportedBiometryType', JSON.stringify({ biometryType: biometryTypeValue }))
        }
    }
    
    //biometrics switch on / off

    static loadIsBiometricsOn = async () => {
        const value = await AsyncStorage.getItem('isBiometricsOn') ?? 'false'
        console.log('isBiometricsOn', JSON.parse(value))
        return (JSON.parse(value) ?? false)
    }

    static saveIsBiometricsOn = async (isOn?: boolean) => {
        await AsyncStorage.setItem('isBiometricsOn', JSON.stringify(isOn ?? false))
    }

    //enable / disable biometrics and save / delete biometry type: Touch ID / Face ID / passcode

    static loadBiometricsSettings = async () => {
        try {
            const biometrics = await AsyncStorage.getItem('biometricsEnabled') ?? 'null'
            let biometricsEnabled = JSON.parse(biometrics) ?? false
            console.log('biometrics settings',biometricsEnabled)
            return biometricsEnabled
        } catch (e) {
            console.log('Load biometrics issue:', e)
            return null
        }
    }

    static saveBiometricsSettings = async (biometryTypeValue?: string | null) => {
        if (biometryTypeValue === null) {
            await SecureStoreHandler.deleteBiometricsSettings()
            await AsyncStorage.setItem('biometricsEnabled', JSON.stringify(null))
            await AsyncStorage.setItem('isBiometricsOn', JSON.stringify(false))
        }
        await AsyncStorage.setItem('biometricsEnabled', JSON.stringify({ biometryType: biometryTypeValue }))
    }

    static deleteBiometricsSettings = async () => {
        try {
            await AsyncStorage.setItem('biometricsEnabled', JSON.stringify({ biometryType: null }))
            await SecureStoreHandler.saveIsBiometricsOn(false)
        } catch (e) {
            console.log('Delete biometrics issue:', e);
        }
    }
}