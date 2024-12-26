import { DicePanel } from "@/components/dice-panel";
import { LogPanel } from "@/components/log-panel";
import { ShareMenu } from "@/components/share";
import { useCurrentUser, useRuleset } from "@/libs/compass-api";
import {
  AppBar,
  IconButton,
  LogoIcon,
  Menu,
  Stack,
  Toolbar,
  useDeviceSize,
} from "@/libs/compass-core-ui";
import { SettingsContext } from "@/libs/compass-web-utils";
import { KeyboardArrowDown, Menu as MenuIcon } from "@mui/icons-material";
import CasinoIcon from "@mui/icons-material/Casino";
import { CSSProperties, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SideNav } from "./components/side-nav";
import { UserMenu } from "./components/user-menu";

export const Navigation = ({
  style,
  permanentSideNav,
}: {
  style?: CSSProperties;
  permanentSideNav: boolean;
}) => {
  const { mobile } = useDeviceSize();
  const { currentUser } = useCurrentUser();
  const [sideNavOpen, setSideNavOpen] = useState<boolean>(false);
  const [mobileActionsMenu, setMobileActionsMenu] = useState<Element | null>(
    null
  );

  const { setDicePanelOpen } = useContext(SettingsContext);

  const navigate = useNavigate();

  const { characterId, rulesetId } = useParams();
  const { ruleset } = useRuleset(rulesetId);
  const isCustom = !characterId && ruleset?.createdById === currentUser?.id;

  const handleNavigateHome = () => {
    if (characterId) {
      navigate(
        `/rulesets/${rulesetId}/characters/${characterId}?selected=sheet`
      );
    } else if (rulesetId) {
      navigate(`/rulesets/${rulesetId}/attributes`);
    }
  };

  return (
    <>
      <AppBar
        id="navigation"
        position="fixed"
        sx={{ p: 0, zIndex: 1000, pl: 2, pr: 2, ...style }}
      >
        <Toolbar disableGutters sx={{ minHeight: "60px !important" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            {!permanentSideNav && (
              <IconButton size="small" onClick={() => setSideNavOpen(true)}>
                <MenuIcon fontSize="small" />
              </IconButton>
            )}

            <IconButton onClick={handleNavigateHome}>
              <LogoIcon />
            </IconButton>

            <div id="nav-start" />
          </Stack>

          <Stack
            direction="row"
            id="nav-center"
            sx={{ flexGrow: 1, pl: 2, pr: 2 }}
            alignItems="center"
            justifyContent="center"
          ></Stack>

          <Stack
            direction="row"
            spacing={mobile ? 1 : 2}
            width="25%"
            justifyContent="flex-end"
          >
            <div id="nav-end" />

            {!mobile ? (
              <>
                {isCustom && <ShareMenu />}
                <IconButton
                  onClick={() => setDicePanelOpen(true)}
                  title="Roll Dice"
                >
                  <CasinoIcon />
                </IconButton>
              </>
            ) : (
              <IconButton
                onClick={(e) => setMobileActionsMenu(e.currentTarget)}
              >
                <KeyboardArrowDown />
              </IconButton>
            )}

            <UserMenu />
          </Stack>
        </Toolbar>
      </AppBar>

      <DicePanel />

      <LogPanel />

      <Menu
        anchorEl={mobileActionsMenu}
        open={!!mobileActionsMenu}
        onClose={() => setMobileActionsMenu(null)}
      >
        <Stack spacing={1} sx={{ minWidth: 80 }} alignItems="center">
          <IconButton
            onClick={() => {
              setDicePanelOpen(true);
              setMobileActionsMenu(null);
            }}
            title="Roll Dice"
          >
            <CasinoIcon />
          </IconButton>
        </Stack>
      </Menu>

      <SideNav
        open={sideNavOpen}
        onClose={() => setSideNavOpen(false)}
        permanentSideNav={permanentSideNav}
      />
    </>
  );
};
