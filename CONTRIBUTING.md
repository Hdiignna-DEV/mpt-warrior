# Contributing Guide untuk MPT Warrior

Terima kasih telah tertarik untuk berkontribusi pada MPT Warrior! Panduan ini akan membantu Anda memulai.

## Code of Conduct

Kami berkomitmen untuk memberikan lingkungan yang welcoming dan inspiring untuk semua kontributor.

## Cara Berkontribusi

### 1. Report Bug

Jika Anda menemukan bug:

1. **Cek dulu** apakah bug sudah dilaporkan di [Issues](https://github.com/yourusername/mpt-warrior/issues)
2. **Buat issue baru** dengan template berikut:

```markdown
## Deskripsi Bug
[Jelaskan bug dengan jelas]

## Langkah Reproduksi
1. [Langkah pertama]
2. [Langkah kedua]
3. [Langkah terakhir]

## Expected Behavior
[Apa yang seharusnya terjadi]

## Actual Behavior
[Apa yang sebenarnya terjadi]

## Environment
- OS: [e.g., Windows 10]
- Node: [e.g., 18.0.0]
- npm: [e.g., 8.0.0]
- Browser: [e.g., Chrome]
```

### 2. Suggest Enhancement

Jika Anda punya ide untuk improvement:

1. **Cek** apakah fitur sudah disarankan sebelumnya
2. **Buat discussion baru** dengan deskripsi detail:
   - Use case
   - Expected behavior
   - Possible implementation

### 3. Submit Pull Request

#### Setup Development Environment

```bash
# Fork repository
git clone https://github.com/your-username/mpt-warrior.git
cd mpt-warrior

# Create feature branch
git checkout -b feature/your-feature-name

# Install dependencies
npm install
```

#### Make Changes

1. **Follow code style**
   - Gunakan TypeScript untuk type safety
   - Follow ESLint rules
   - Format code dengan Prettier

2. **Write meaningful commits**
   ```bash
   git commit -m "feat: add new feature description"
   ```

   Format commit messages:
   - `feat:` untuk fitur baru
   - `fix:` untuk bug fix
   - `docs:` untuk dokumentasi
   - `style:` untuk formatting
   - `refactor:` untuk code refactoring
   - `perf:` untuk performance improvement
   - `test:` untuk test

3. **Test your changes**
   ```bash
   npm run lint
   npm run type-check
   npm run dev
   ```

#### Submit PR

1. **Push changes**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Open Pull Request**
   - Gunakan template yang disediakan
   - Jelaskan apa yang berubah
   - Reference related issues dengan `Closes #123`

3. **Code Review**
   - Respons dengan cepat terhadap feedback
   - Lakukan requested changes
   - Jika ada konflik, resolve dengan main branch

## Development Guidelines

### Project Structure
```
src/
├── app/           # Next.js pages dan layout
├── components/    # React components
├── utils/        # Utility functions
└── types/        # TypeScript types
```

### Naming Conventions

- **Components**: PascalCase (e.g., `TradeJournal.tsx`)
- **Functions**: camelCase (e.g., `calculateRisk()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RISK_PERCENT`)
- **Interfaces**: PascalCase dengan prefix I (e.g., `ITrade`)

### TypeScript Best Practices

```typescript
// ✅ Good
interface Trade {
  id: string;
  pair: string;
  entryPrice: number;
}

const calculateRisk = (balance: number, riskPercent: number): number => {
  return (balance * riskPercent) / 100;
};

// ❌ Avoid
const calculateRisk = (balance, riskPercent) => {
  return (balance * riskPercent) / 100;
};
```

### Component Guidelines

```typescript
// ✅ Good component structure
'use client';

import { useState } from 'react';
import { ComponentIcon } from 'lucide-react';

interface ComponentProps {
  title: string;
  data: DataType[];
}

export default function MyComponent({ title, data }: ComponentProps) {
  const [state, setState] = useState(false);

  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
}
```

### CSS/Tailwind Guidelines

- Gunakan Tailwind CSS utility classes
- Kelompokkan related classes
- Hindari inline styles
- Responsive design dengan breakpoints

```typescript
// ✅ Good
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ Avoid inline styles
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
```

## Documentation

- Update README.md jika ada fitur baru
- Tambah docstring untuk functions kompleks
- Update ROADMAP.md jika ada perubahan planning
- Buat comments untuk logic yang tidak obvious

## Testing

Jika menambah fitur baru:

1. **Manual testing** di development environment
2. **Test di berbagai browser** (Chrome, Firefox, Safari)
3. **Test responsive design** (mobile, tablet, desktop)
4. **Test accessibility** dengan screen reader jika applicable

## Questions?

- Cek [DEVELOPMENT.md](DEVELOPMENT.md) untuk setup guide
- Baca [ROADMAP.md](ROADMAP.md) untuk understanding project direction
- Join [Discussions](https://github.com/yourusername/mpt-warrior/discussions) untuk pertanyaan umum

---

**Terima kasih atas kontribusi Anda! 🙏**
