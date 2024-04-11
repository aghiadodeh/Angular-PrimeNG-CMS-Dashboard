import { Data, Route } from "@angular/router";

export interface NavigationItem {
  route: string;
  title: string;
  visible?: boolean;
  visibleFn?: () => boolean;
  children?: NavigationItem[];
}

export function mapRouteToNavigationItem(
  route: Route,
  visibleFn?: (data?: Data) => boolean,
  parent?: Route,
): NavigationItem {
  const data = route.data ?? {};
  const children = route.children
    ?.filter((route) => route.data?.["sideNav"] == true)
    .map((child: Route) => mapRouteToNavigationItem(child, (data) => visibleFn?.(data) ?? true, route));

  return {
    route: parent ? `${parent.path}/${route.path}` : route.path ?? "",
    title: data["title"],
    children,
    visibleFn: () => visibleFn?.(route.data) ?? true,
  };
}
