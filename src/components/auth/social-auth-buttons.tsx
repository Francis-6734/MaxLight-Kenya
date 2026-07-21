import { Button } from "@/components/ui/button";
import { signInWithOAuthAction } from "@/lib/actions/auth-actions";
import { GoogleIcon, FacebookIcon } from "@/components/icons/social-icons";

export function SocialAuthButtons({ callbackUrl }: { callbackUrl?: string }) {
  return (
    <div className="space-y-2.5">
      <form action={signInWithOAuthAction.bind(null, "google")}>
        {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
        <Button type="submit" variant="outline" size="lg" className="h-11 w-full gap-2.5">
          <GoogleIcon className="h-4 w-4" />
          Continue with Google
        </Button>
      </form>
      <form action={signInWithOAuthAction.bind(null, "facebook")}>
        {callbackUrl && <input type="hidden" name="callbackUrl" value={callbackUrl} />}
        <Button type="submit" variant="outline" size="lg" className="h-11 w-full gap-2.5">
          <FacebookIcon className="h-4 w-4 text-[#1877F2]" />
          Continue with Facebook
        </Button>
      </form>
    </div>
  );
}
