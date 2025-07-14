/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/calendar` | `/(tabs)/media` | `/(tabs)/settings` | `/_sitemap` | `/calendar` | `/media` | `/settings`;
      DynamicRoutes: `/trip/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/trip/[id]`;
    }
  }
}
