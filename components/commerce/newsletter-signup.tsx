export function NewsletterSignup() {
  return (
    <section className="bg-sand py-16">
      <div className="site-container max-w-2xl">
        <h2 className="text-section-title">Email updates</h2>
        <p className="mt-3 text-muted">
          A mailing list is not connected yet, so this form cannot send messages. When
          email updates are live, this will be the place to hear about seasonal produce.
        </p>
        <fieldset disabled className="mt-6 border-0 p-0">
          <legend className="sr-only">Email signup is not available yet</legend>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor="newsletter-email">
              Email address
            </label>
            <input
              id="newsletter-email"
              name="email"
              type="email"
              disabled
              placeholder="Email address"
              autoComplete="email"
              className="min-h-11 flex-1 rounded-sm border border-line bg-canvas px-3 text-ink"
            />
            <span className="btn-disabled">Sign up — coming later</span>
          </div>
        </fieldset>
      </div>
    </section>
  );
}
