export default function InputError({ messages }: { messages?: string[] }) {
    if (!messages?.length) return null;
    return <p className="field-error">{messages[0]}</p>;
}