// TODO: To avoid losing data on browser reloads, may be better to
// TODO: instead use localStorage to store some data in the browser

export default class GlobalVariables {
    // Place all global variables in here
    static authenticated = false;
    static backendURL = "http://localhost:5019"
    static userCredential;
    static email;
    static isActivated;
    static isMod = false;

    static events = [];
}