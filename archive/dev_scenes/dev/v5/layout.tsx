
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'FlowAssistant Studio V5',
    description: 'Virtual Studio Environment',
};

export default function DevV5Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
