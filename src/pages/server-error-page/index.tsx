import { ErrorState } from '@/widgets/error-state'

export default function ServerErrorPage() {
  return <ErrorState code={500} />
}
