export function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold">About &amp; Privacy</h1>
      <p className="mt-4 text-ink-soft">
        Job Application Toolkit is a free set of tools to help jobseekers analyze job
        descriptions, match their CV against a role, draft cover letters, and practice
        interviews.
      </p>

      <h2 className="mt-10 text-xl font-bold">Privacy</h2>
      <div className="mt-4 space-y-4 text-ink-soft">
        <p>
          Your CV is not stored on a server for the core tools — analysis is designed to run
          locally in your browser wherever possible.
        </p>
        <p>
          The Application Tracker saves the data you enter (company, position, status, and so
          on) in your browser's local storage, on your own device. It is not sent anywhere.
        </p>
        <p>
          No CV or job description content is sent to third-party AI APIs by this toolkit.
        </p>
        <p>
          Screenshot uploads (for the Job Description Analyzer or CV Matcher) are read using
          on-device text recognition — the image itself is never uploaded anywhere. The first
          time you use this feature, your browser downloads the recognition engine from a public
          library CDN (not this app's server); after that it's cached locally.
        </p>
        <p>
          You can clear your locally saved tracker data at any time from the Tracker page, or
          back it up first using <strong>Export Data</strong> (downloads a JSON file you can
          re-import later or on another device via <strong>Import Data</strong>). Clearing your
          browser data, using a different browser, or switching devices will remove this local
          data — there is no account or automatic cloud backup in this version.
        </p>
        <p className="text-sm">
          This is general information about how the app is built, not an absolute security
          guarantee.
        </p>
      </div>
    </div>
  );
}
