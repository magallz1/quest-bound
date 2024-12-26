import {
  Button,
  Divider,
  Drawer,
  IconButton,
  Input,
  LogoIcon,
  MenuItem,
  Paper,
  Select,
  Stack,
  Text,
  Tooltip,
} from "@/libs/compass-core-ui";
import { SettingsContext } from "@/libs/compass-web-utils";
import { PageTree } from "@/pages/ruleset/rulebook/components/page-tree";
import { FilterAlt, FilterAltOff, FolderOpen } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SettingsIcon from "@mui/icons-material/Settings";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { CharacterNav } from "./character-nav";
import { ChartSelect } from "./chart-select";
import { DocumentSelect } from "./document-select";
import { RulesetNav } from "./ruleset-nav";

interface SideNavProps {
  open: boolean;
  onClose: () => void;
  permanentSideNav?: boolean;
}

export const SideNav = ({ open, onClose, permanentSideNav }: SideNavProps) => {
  const { openSettingsModal } = useContext(SettingsContext);
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const { characterId, rulesetId } = useParams();

  const [menuValue, setMenuValue] = useState<
    "journal" | "rulebook" | "documents" | "charts"
  >("journal");
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>("");

  const location = useLocation();

  const renderRulesetNav =
    !characterId || !location.pathname.includes("character");

  const selectionIsActive = !!rulesetId || !!characterId;

  // Clears the current page when switching between journal and rulebook
  // Without this, journal pages could be assigned as children of rulebook pages and vice versa
  useEffect(() => {
    params.set("page", "");
    setParams(params);
  }, [menuValue]);

  useEffect(() => {
    if (!characterId) {
      setMenuValue("journal");
    }
  }, [characterId]);

  const handleNavSelection = (path?: string) => {
    onClose?.();
    if (path) {
      navigate(path);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant={permanentSideNav ? "permanent" : "temporary"}
      sx={{ "& > div": { zIndex: 900, overflowX: "hidden" } }}
    >
      <Stack
        direction="column"
        sx={{ width: 240, height: "100%", bgcolor: "background.default" }}
      >
        <Paper
          square
          sx={{
            width: "100%",
            pl: 2,
            pr: 2,
            minHeight: 60,
            borderRight: "none",
          }}
        >
          <Stack
            height="100%"
            direction="row"
            alignItems="center"
            spacing={permanentSideNav ? 2 : 0}
            justifyContent={permanentSideNav ? "flex-start" : "space-between"}
          >
            <IconButton onClick={() => handleNavSelection("/")}>
              <LogoIcon />
            </IconButton>
            <Text fontFamily="CygnitoMonoPro">Quest Bound</Text>
            {!permanentSideNav && (
              <IconButton onClick={onClose}>
                <ChevronLeftIcon />
              </IconButton>
            )}
          </Stack>
        </Paper>

        <Stack direction="column" pt={2}>
          {renderRulesetNav ? (
            <RulesetNav onClose={onClose} />
          ) : (
            <CharacterNav onClose={onClose} />
          )}

          {selectionIsActive && <Divider sx={{ mt: 1, mb: 1 }} />}

          <Stack pl={1}>
            <Button
              variant="text"
              onClick={() => {
                onClose();
                openSettingsModal(true);
              }}
              sx={{ flexGrow: "1", display: "flex", justifyContent: "start" }}
              startIcon={<SettingsIcon fontSize="small" />}
            >
              <Text>Settings</Text>
            </Button>

            {selectionIsActive && (
              <Button
                variant="text"
                onClick={() => {
                  localStorage.removeItem("last-viewed-ruleset-id");
                  navigate("/");
                  onClose?.();
                }}
                sx={{ flexGrow: "1", display: "flex", justifyContent: "start" }}
                startIcon={<FolderOpen fontSize="small" />}
              >
                <Text>Open</Text>
              </Button>
            )}
          </Stack>

          {selectionIsActive && (
            <>
              <Divider sx={{ mt: 1, mb: 1 }} />
              <Stack
                direction="row"
                padding={1}
                justifyContent={"space-between"}
                alignItems="flex-start"
              >
                {!renderRulesetNav ? (
                  <Select
                    id="character-nav-select"
                    sx={{ height: 25, width: 140 }}
                    value={menuValue}
                    onChange={(e) => setMenuValue(e.target.value as any)}
                    ignoreHelperText
                  >
                    <MenuItem value="journal">Journal</MenuItem>
                    <MenuItem value="rulebook">Rulebook</MenuItem>
                    <MenuItem value="documents">Documents</MenuItem>
                    <MenuItem value="charts">Charts</MenuItem>
                  </Select>
                ) : (
                  <Text sx={{ whiteSpace: "nowrap", fontSize: "0.9rem" }}>
                    Rulebook
                  </Text>
                )}

                <Stack direction="row" spacing={2}>
                  <Tooltip
                    title={filterOpen ? "Close Filter" : "Open Filter"}
                    placement="top"
                  >
                    <IconButton onClick={() => setFilterOpen((prev) => !prev)}>
                      {filterOpen ? (
                        <FilterAltOff fontSize="small" />
                      ) : (
                        <FilterAlt fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
              {filterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0, width: "100%" }}
                  animate={{ height: 50, opacity: 1 }}
                  transition={{ duration: 0.2, type: "spring" }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <Stack
                    height="100%"
                    alignItems="center"
                    direction="row"
                    p={1}
                    pb={3}
                  >
                    <Input
                      id="page-tree-filter"
                      fullWidth
                      ignoreHelperText
                      placeholder="Filter"
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                    />
                  </Stack>
                </motion.div>
              )}

              {menuValue === "journal" && characterId && (
                <PageTree title="Journal" journal filterValue={filterValue} />
              )}

              {(menuValue === "rulebook" || !characterId) && (
                <PageTree
                  title="Rulebook"
                  readOnly={!!characterId}
                  hideHeader={!renderRulesetNav}
                  filterValue={filterValue}
                />
              )}

              {menuValue === "documents" && (
                <DocumentSelect filterValue={filterValue} />
              )}

              {menuValue === "charts" && (
                <ChartSelect filterValue={filterValue} />
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Drawer>
  );
};
