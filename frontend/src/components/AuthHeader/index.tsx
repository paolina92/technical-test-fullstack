import { Link } from "react-router-dom";
import { Button } from "welcome-ui/Button";
import { Loader } from "welcome-ui/Loader";
import { Text } from "welcome-ui/Text";

import type { CurrentUser } from "../../schemas/user";

export type AuthHeaderProps = {
  hasBearerToken: boolean;
  user: CurrentUser | null;
  onLogout: () => void | Promise<void>;
};

export const AuthHeader = ({
  hasBearerToken,
  user,
  onLogout,
}: AuthHeaderProps) => {
  if (!hasBearerToken) {
    return (
      <div className="flex gap-sm">
        <Button as={Link} to="/signup" size="sm">
          Sign up
        </Button>
        <Button as={Link} to="/signin" size="sm" variant="tertiary">
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-sm">
      {user ? (
        <>
          <Text variant="body-sm">{user.email}</Text>
          <Button size="sm" variant="tertiary" onClick={onLogout}>
            Logout
          </Button>
        </>
      ) : (
        <Loader size="sm" />
      )}
    </div>
  );
};
