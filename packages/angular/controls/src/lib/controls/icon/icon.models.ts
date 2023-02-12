export enum IconMode {
  SvgData,
  SvgUrl,
  IconFont,
}

export interface ModuleOptions {
  additionalClasses?: string;
  classPrefix?: string;
  classSuffix?: string;
  defaultMode?: IconMode;
}
