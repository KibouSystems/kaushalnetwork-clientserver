import {useState} from "react";

export default function RegisterCompany() {
    const [formData, setFormData] = useState({
        typeOfEnterprise: "",
        nameOfBusiness: "",
        email: "",
        password: "",
        confirmPassword: "",
        tradeName: "",
        legalName: "",
        logo: null as File | null,
        brandNames: [] as string[],
        typeOfEntity: "",
        incorporationYear: "",
        registeredOffice: "",
        branchAddress: "",
        websiteLink: "",
        businessInvolvement: "",
        goods: [] as string[],
        services: [] as string[],
        others: [] as string[],
        sector: "",
        industry: "",
        noOfEmployees: "",
        experience: "",
        contact1: {name: "", designation: "", email: "", contactNo: ""},
        contact2: {name: "", designation: "", email: "", contactNo: ""},
        statutory: {
            msmeRegNo: "",
            msmeRegAttachment: null as File | null,
            cin: "",
            cinAttachment: null as File | null,
            pan: "",
            panAttachment: null as File | null,
            gstin: "",
            gstinAttachment: null as File | null,
            tradeLicenseNo: "",
            tradeLicenseAttachment: null as File | null,
            iecNo: "",
            iecAttachment: null as File | null,
            aadharNo: "",
            aadharAttachment: null as File | null,
            otherDetails: ""
        }
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const {name, files} = e.target;
        if (files && files.length > 0) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        console.log(formData);
        alert("Form submitted!");
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 p-8">
            <h2 className="text-2xl font-bold">Basic Information</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Type of Enterprise</label>
                    <input name="typeOfEnterprise" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Name of Business</label>
                    <input name="nameOfBusiness" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Email</label>
                    <input name="email" type="email" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Create Password</label>
                    <input name="password" type="password" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input name="confirmPassword" type="password" onChange={handleChange}
                           className="border p-2 w-full"/>
                </div>
            </div>

            <h2 className="text-2xl font-bold mt-8">Enterprise Details</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Trade Name</label>
                    <input name="tradeName" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Legal Name</label>
                    <input name="legalName" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Logo</label>
                    <input name="logo" type="file" onChange={handleFileChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Type of Entity</label>
                    <select name="typeOfEntity" onChange={handleChange} className="border p-2 w-full">
                        <option>Company</option>
                        <option>LLP</option>
                        <option>Proprietor</option>
                        <option>Joint Venture</option>
                        <option>Foreign Company</option>
                    </select>
                </div>
            </div>

            {/* Products and Services */}
            <h2 className="text-2xl font-bold mt-8">Products and Services</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Business Involvement</label>
                    <input name="businessInvolvement" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Sector</label>
                    <input name="sector" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Industry</label>
                    <input name="industry" onChange={handleChange} className="border p-2 w-full"/>
                </div>
            </div>

            {/* Contact Details */}
            <h2 className="text-2xl font-bold mt-8">Contact Details</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>Person 1 Name</label>
                    <input name="contact1.name" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Person 1 Designation</label>
                    <input name="contact1.designation" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Person 1 Email</label>
                    <input name="contact1.email" type="email" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>Person 1 Contact No</label>
                    <input name="contact1.contactNo" onChange={handleChange} className="border p-2 w-full"/>
                </div>
            </div>

            {/* Statutory Details */}
            <h2 className="text-2xl font-bold mt-8">Statutory Details</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label>MSME Reg. No</label>
                    <input name="statutory.msmeRegNo" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>CIN/LLP-CIN</label>
                    <input name="statutory.cin" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>PAN</label>
                    <input name="statutory.pan" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                <div>
                    <label>GSTIN No.</label>
                    <input name="statutory.gstin" onChange={handleChange} className="border p-2 w-full"/>
                </div>
                {/* You can similarly add file inputs for attachments */}
            </div>

            <button type="submit" className="bg-blue-600 text-white p-3 rounded mt-6">Submit</button>
        </form>
    );
}