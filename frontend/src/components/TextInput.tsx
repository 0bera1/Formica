// Desc: Text input component for forms
interface TextInputProps {
    label: string;
    placeholder: string;
    type: string;
    id: string;
    icon?: React.ReactNode;
}

function TextInput({ label, placeholder, type, id, icon }: TextInputProps) {
    return (
        <div>
            <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="text-gray-400 text-sm">
                    {label}
                </label>
                <div className="relative">
                    {icon}
                    <input
                        id={id}
                        type={type}
                        placeholder={placeholder}
                        required
                        className="w-full py-3 pl-10 pr-4 rounded-lg text-sm text-gray-200 bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>
        </div>
    )
}

export default TextInput
