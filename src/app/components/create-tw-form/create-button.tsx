interface Props {
    inputValue: string;
    isPending: boolean;
}

const CreateButton = async ({ params }: { params: Promise<Props> }) => {
    const { inputValue, isPending } = await params;
    return (
        <button type="submit" disabled={isPending || !inputValue}>{isPending ? 'Creating...' : 'Create'}</button>
    );
};

export default CreateButton;
