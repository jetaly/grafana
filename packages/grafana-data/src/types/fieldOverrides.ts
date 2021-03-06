import { ComponentType } from 'react';
import { MatcherConfig, FieldConfig, Field, DataFrame, GrafanaTheme, TimeZone } from '../types';
import { InterpolateFunction } from './panel';
import { StandardEditorProps, FieldConfigOptionsRegistry, StandardEditorContext } from '../field';
import { OptionsEditorItem } from './OptionsUIRegistryBuilder';
import { OptionEditorConfig } from './options';

export interface DynamicConfigValue {
  id: string;
  value?: any;
}

export interface ConfigOverrideRule {
  matcher: MatcherConfig;
  properties: DynamicConfigValue[];
}

export interface FieldConfigSource<TOptions extends object = any> {
  // Defaults applied to all numeric fields
  defaults: FieldConfig<TOptions>;

  // Rules to override individual values
  overrides: ConfigOverrideRule[];
}

export interface FieldOverrideContext extends StandardEditorContext<any> {
  field?: Field;
  dataFrameIndex?: number; // The index for the selected field frame
  data: DataFrame[]; // All results
}
export interface FieldConfigEditorProps<TValue, TSettings>
  extends Omit<StandardEditorProps<TValue, TSettings>, 'item'> {
  item: FieldConfigPropertyItem<any, TValue, TSettings>; // The property info
  value: TValue;
  context: FieldOverrideContext;
  onChange: (value?: TValue) => void;
}

export interface FieldOverrideEditorProps<TValue, TSettings> extends Omit<StandardEditorProps<TValue>, 'item'> {
  item: FieldConfigPropertyItem<TValue, TSettings>;
  context: FieldOverrideContext;
}

export interface FieldConfigEditorConfig<TOptions, TSettings = any, TValue = any>
  extends OptionEditorConfig<TOptions, TSettings, TValue> {
  /**
   * Function that allows specifying whether or not this field config should apply to a given field.
   * @param field
   */
  shouldApply?: (field: Field) => boolean;
}

export interface FieldConfigPropertyItem<TOptions = any, TValue = any, TSettings extends {} = any>
  extends OptionsEditorItem<TOptions, TSettings, FieldConfigEditorProps<TValue, TSettings>, TValue> {
  // An editor that can be filled in with context info (template variables etc)
  override: ComponentType<FieldOverrideEditorProps<TValue, TSettings>>;

  /** true for plugin field config properties */
  isCustom?: boolean;

  // Convert the override value to a well typed value
  process: (value: any, context: FieldOverrideContext, settings?: TSettings) => TValue | undefined | null;

  // Checks if field should be processed
  shouldApply: (field: Field) => boolean;
}

export interface ApplyFieldOverrideOptions {
  data?: DataFrame[];
  fieldConfig: FieldConfigSource;
  replaceVariables: InterpolateFunction;
  theme: GrafanaTheme;
  timeZone?: TimeZone;
  fieldConfigRegistry?: FieldConfigOptionsRegistry;
}

export enum FieldConfigProperty {
  Unit = 'unit',
  Min = 'min',
  Max = 'max',
  Decimals = 'decimals',
  DisplayName = 'displayName',
  NoValue = 'noValue',
  Thresholds = 'thresholds',
  Mappings = 'mappings',
  Links = 'links',
  Color = 'color',
}
