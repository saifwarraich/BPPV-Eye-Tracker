import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarBrand,
} from "@nextui-org/react";
import { MoonIcon } from "../assets/MoonIcon";
import { SunIcon } from "../assets/SunIcon";
import { Switch } from "@nextui-org/react";
import useDarkMode from "use-dark-mode";
import { Tabs, Tab } from "@nextui-org/react";
import { useVideoMode } from "../Context/VideoModeContext";

export default function Topbar() {
  const { isLive, toggleVideoMode } = useVideoMode();
  const darkMode = useDarkMode(false);
  return (
    <Navbar shouldHideOnScroll>
      <NavbarBrand>
        <p className="font-bold text-inherit">BPPV</p>
      </NavbarBrand>
      <NavbarContent className="sm:flex gap-4" justify="center">
        <NavbarItem className="">
          <Tabs
            size="md"
            variant="underlined"
            color="primary"
            radius="lg"
            onSelectionChange={(e) => {
              if ((e === "live" && !isLive) || (e === "offline" && isLive))
                toggleVideoMode();
            }}
          >
            <Tab key="live" title="Live" />
            <Tab key="offline" title="Offline" />
          </Tabs>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
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
