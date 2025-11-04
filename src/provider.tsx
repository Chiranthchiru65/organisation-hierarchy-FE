// import type { NavigateOptions } from "react-router-dom";

// import { HeroUIProvider } from "@heroui/system";
// import { useHref, useNavigate } from "react-router-dom";

// declare module "@react-types/shared" {
//   interface RouterConfig {
//     routerOptions: NavigateOptions;
//   }
// }

// export function Provider({ children }: { children: React.ReactNode }) {
//   const navigate = useNavigate();

//   return (
//     <HeroUIProvider navigate={navigate} useHref={useHref}>
//       {children}
//     </HeroUIProvider>
//   );
// }

import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useTheme, ThemeProps } from "@heroui/use-theme";
import { useEffect } from "react";
import { useHref, useNavigate } from "react-router-dom";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <ThemeInitializer />
      {children}
    </HeroUIProvider>
  );
}

const ThemeInitializer = () => {
  const { setTheme } = useTheme(ThemeProps.LIGHT);

  useEffect(() => {
    const storedTheme = localStorage.getItem(ThemeProps.KEY);
    if (!storedTheme) {
      setTheme(ThemeProps.LIGHT);
    }
  }, [setTheme]);

  return null;
};
