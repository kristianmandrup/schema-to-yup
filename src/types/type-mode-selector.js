export class TypeModeSelector {
  get mode() {
    return this.config.mode || {};
  }
  
  get disableFlags() {
    return [false, "disabled", "no", "off"];
  }
  
  get enableFlags() {
    return [true, "enabled", "yes", "on"];
  }
  
  disabledMode(modeName) {
    const modeEntry = this.mode[modeName];
    return !!this.disableFlags.find(disable => modeEntry === disable);
  }
  
  enabledMode(modeName) {
    const modeEntry = this.mode[modeName];
    return !!this.enableFlags.find(disable => modeEntry === disable);
  }
}
