import { routes } from "@/routes";

export function getPageName(path: string) {
  for (const route of routes) {
    for (const page of route.pages) {
      if (page.path === path) return page.name;
    }
  }
  return ""; 
}