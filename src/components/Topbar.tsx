import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { MoonIcon } from "../assets/MoonIcon";
import { SunIcon } from "../assets/SunIcon";
import { Switch } from "@nextui-org/react";
import useDarkMode from "use-dark-mode";

export default function Topbar() {
  const darkMode = useDarkMode(false);
  return (
    <Navbar shouldHideOnScroll>
      {/* <NavbarBrand> */}

      <p className="font-bold text-inherit">Saif</p>
      {/* </NavbarBrand> */}
      {/* <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent> */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Switch
            onValueChange={() => {
              console.log("herer", darkMode.value);

              darkMode.value ? darkMode.disable() : darkMode.enable();
            }}
            // defaultSelected={}
            startContent={<SunIcon />}
            endContent={<MoonIcon />}
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
