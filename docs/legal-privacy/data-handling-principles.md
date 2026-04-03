# Data handling principles (draft)

Not legal advice. Refine with counsel before launch.

## Categories of data (expected)

- **Phone numbers** — account identity and discovery; highest sensitivity.
- **Verification events** — timestamps, delivery status, IP/device signals used for fraud prevention.
- **Profile and content** — posts, media metadata, friend graph edges.
- **Support and safety** — reports, moderation actions, appeals.

## Principles

1. **Minimize**: collect only what the product needs; document each field’s purpose.
2. **Limit retention**: define how long verification logs, content, and backups are kept.
3. **Access control**: internal access on need-to-know basis; audit for production data.
4. **User rights**: plan for export and deletion aligned with applicable regulations (jurisdiction-dependent).

## Cross-references

- Product: [../product/phone-verification-spec.md](../product/phone-verification-spec.md)
- Third parties: [third-parties.md](third-parties.md)
