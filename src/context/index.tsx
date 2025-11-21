import React, {
  createContext,
  useReducer,
  useMemo,
  useContext,
  Dispatch,
  ReactNode,
} from "react";

import type { SidenavType, MTColor } from "@/types/ui";

export interface MaterialTailwindState {
  openSidenav: boolean;
  sidenavColor: MTColor;
  sidenavType: SidenavType;
  transparentNavbar: boolean;
  fixedNavbar: boolean;
  openConfigurator: boolean;
}

export type MaterialTailwindAction =
  | { type: "OPEN_SIDENAV"; value: boolean }
  | { type: "SIDENAV_TYPE"; value: SidenavType }
  | { type: "SIDENAV_COLOR"; value: MTColor }
  | { type: "TRANSPARENT_NAVBAR"; value: boolean }
  | { type: "FIXED_NAVBAR"; value: boolean }
  | { type: "OPEN_CONFIGURATOR"; value: boolean };

// Context 타입
export type MaterialTailwindContextType = [
  MaterialTailwindState,
  Dispatch<MaterialTailwindAction>
] | null;

export const MaterialTailwind = createContext<MaterialTailwindContextType>(null);
MaterialTailwind.displayName = "MaterialTailwindContext";

// Reducer
export function reducer(
  state: MaterialTailwindState,
  action: MaterialTailwindAction
): MaterialTailwindState {
  switch (action.type) {
    case "OPEN_SIDENAV":
      return { ...state, openSidenav: action.value };
    case "SIDENAV_TYPE":
      return { ...state, sidenavType: action.value };
    case "SIDENAV_COLOR":
      return { ...state, sidenavColor: action.value };
    case "TRANSPARENT_NAVBAR":
      return { ...state, transparentNavbar: action.value };
    case "FIXED_NAVBAR":
      return { ...state, fixedNavbar: action.value };
    case "OPEN_CONFIGURATOR":
      return { ...state, openConfigurator: action.value };
    default:
      throw new Error(`Unhandled action type`);
  }
}

// Provider Props 타입
interface MaterialTailwindProviderProps {
  children: ReactNode;
}

// Provider
export function MaterialTailwindControllerProvider({
  children,
}: MaterialTailwindProviderProps) {
  const initialState: MaterialTailwindState = {
    openSidenav: false,
    sidenavColor: "gray",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
  };

  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => [controller, dispatch] as [MaterialTailwindState, Dispatch<MaterialTailwindAction>],
    [controller]
  );

  return (
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

// Hook
export function useMaterialTailwindController() {
  const context = useContext(MaterialTailwind);

  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    );
  }

  return context;
}

MaterialTailwindControllerProvider.displayName = "/src/context/index.tsx";

export const setOpenSidenav = (dispatch: Dispatch<MaterialTailwindAction>, value: boolean) =>
  dispatch({ type: "OPEN_SIDENAV", value });

export const setSidenavType = (dispatch: Dispatch<MaterialTailwindAction>, value: SidenavType) =>
  dispatch({ type: "SIDENAV_TYPE", value });

export const setSidenavColor = (dispatch: Dispatch<MaterialTailwindAction>, value: MTColor) =>
  dispatch({ type: "SIDENAV_COLOR", value });

export const setTransparentNavbar = (
  dispatch: Dispatch<MaterialTailwindAction>,
  value: boolean
) => dispatch({ type: "TRANSPARENT_NAVBAR", value });

export const setFixedNavbar = (dispatch: Dispatch<MaterialTailwindAction>, value: boolean) =>
  dispatch({ type: "FIXED_NAVBAR", value });

export const setOpenConfigurator = (
  dispatch: Dispatch<MaterialTailwindAction>,
  value: boolean
) => dispatch({ type: "OPEN_CONFIGURATOR", value });