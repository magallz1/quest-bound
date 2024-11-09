import { useReduceCache } from '@/hooks';
import { useCurrentUser, useRuleset, useSignOut } from '@/libs/compass-api';
import { RenderNotifications } from '@/libs/compass-core-composites';
import { Loading, useDeviceSize } from '@/libs/compass-core-ui';
import { EnvContext } from '@/libs/compass-web-utils';
import { Navigation, SettingsModal, SignIn } from '@/pages';
import { Onboarding } from '@/pages/onboarding';
import { QuickCreateModal } from '@/pages/ruleset/components';
import { useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

export function Layout() {
  const { currentUser, loading: userLoading } = useCurrentUser();
  const { signOut } = useSignOut();
  const { desktop } = useDeviceSize();

  const { rulesetId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const quickCreatePage = searchParams.get('quick-create');

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isHomePage = pathname === '/';

  const { error, loading: rulesetLoading } = useRuleset(rulesetId);
  const loading = userLoading || rulesetLoading;

  useEffect(() => {
    if (error) {
      navigate('/', { replace: true });
    }
  }, [error]);

  useReduceCache();

  const { maintenance, environment } = useContext(EnvContext);
  const bypassMaintenance = localStorage.getItem('bypassMaintenance') === 'true';

  const enableMaintenance = maintenance.includes(environment);

  useEffect(() => {
    if (enableMaintenance && !bypassMaintenance && !!currentUser) {
      signOut();
    }
  }, [enableMaintenance, currentUser]);

  const shouldCollapseSideNav =
    isHomePage ||
    [/\/sheet-templates\/[\w-]+/, /\/page-templates\/[\w-]+/].some((path) => path.test(pathname)) ||
    searchParams.get('selected') === 'sheet' ||
    searchParams.get('selected') === 'simple-sheet';

  const permanentNav = !!currentUser && desktop && !shouldCollapseSideNav;

  return (
    <>
      {currentUser && <Navigation permanentSideNav={permanentNav} />}
      <main
        style={{
          marginLeft: permanentNav && !loading ? 240 : 0,
          display: 'grid',
          minHeight: '60vh',
          height: 'calc(100dvh - 60px)',
          gridTemplateColumns: '1fr',
          gridTemplateRows: '1fr',
          paddingTop: currentUser || loading ? '60px' : 0,
          width: permanentNav && !loading ? 'calc(100vw - 240px)' : '100vw',
        }}>
        {loading ? <Loading /> : currentUser ? <Outlet /> : <SignIn />}

        {!enableMaintenance && <Onboarding />}
      </main>
      <RenderNotifications />
      <SettingsModal />
      <QuickCreateModal
        onClose={() => {
          searchParams.delete('quick-create');
          searchParams.delete('attributeId');
          setSearchParams(searchParams);
        }}
        quickCreatePage={quickCreatePage}
      />
    </>
  );
}
