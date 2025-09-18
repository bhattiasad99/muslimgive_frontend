export const dynamic = 'force-dynamic'
import LinkComponent from "@/components/common/LinkComponent";
import { Button } from "@/components/ui/button";
import SignOutBtnInHome from "@/components/use-case/sign-out-button-in-home/SignOutBtnInHome";
import { getMe } from "./actions/general";

export default async function Home() {
  const { ok, unauthenticated } = await getMe();
  console.log({ ok, unauthenticated });
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      Welcome to MuslimGive!
      <div className="">
        {unauthenticated ? <LinkComponent to="/login">
          <Button>Login</Button>
        </LinkComponent> : <div className="flex gap-2">
          <LinkComponent to="/charities">
            <Button>
              Home
            </Button>
          </LinkComponent>
          <SignOutBtnInHome>Sign Out</SignOutBtnInHome>
        </div>
        }
      </div>
    </div>
  );
}
