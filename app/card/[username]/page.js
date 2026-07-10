import { redirect } from 'next/navigation';

/**
 * Redirect old /card/[username] routes to root-level /[username] routes.
 */
export default async function Page({ params }) {
  const resolvedParams = await params;
  const username = resolvedParams.username?.trim().toLowerCase();
  
  if (username) {
    redirect(`/${username}`);
  } else {
    redirect('/');
  }
}
