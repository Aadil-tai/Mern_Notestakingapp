const ErrorMesseage = ({ variant = "red", children }) => {
    const colorMap = {
        red: "bg-red-100 text-red-700 border-red-400",
        green: "bg-green-100 text-green-700 border-green-400"
    };

    return (
        <div className={`border ${colorMap[variant]} px-4 py-3 rounded relative mb-4`}>
            <span className="block sm:inline">{children}</span>
        </div>
    );
};

export default ErrorMesseage;
