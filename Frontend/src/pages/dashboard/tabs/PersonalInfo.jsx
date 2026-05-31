import { 
    Mail, Calendar, MapPin, VenusAndMars, 
    Droplets, Ruler, Scale, User 
} from 'lucide-react';

const PersonalInfo = ({ userData, isEditing, onInputChange }) => {
    
    const renderInputField = (id, type, value, placeholder, fieldName) => {
        if (isEditing) {
            return (
                <input
                    type={type}
                    value={value || ''}
                    placeholder={placeholder}
                    onChange={(e) => onInputChange(fieldName, e.target.value)}
                    className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary transition-colors mt-0.5"
                />
            );
        }
        return (
            <p className={`text-sm font-semibold text-foreground ${type === 'email' ? 'break-all select-all' : 'wrap-break-word'}`}>
                {value || 'Not set'}
            </p>
        );
    };

    return (
        <div className="space-y-8">
            {/* SECTION: IDENTITY & CONTACT */}
            <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-5 ml-2">
                    Identity & Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* First Name */}
                    <div className="bg-card border border-border/40 p-5 rounded-4xl flex items-center gap-4 transition-all hover:border-border/80">
                        <div className="p-3 bg-primary/5 text-primary rounded-2xl shrink-0">
                            <User size={18} strokeWidth={1.5} />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">
                                First Name
                            </p>
                            {renderInputField('firstName', 'text', userData?.firstName, 'e.g. Juan', 'firstName')}
                        </div>
                    </div>

                    {/* Last Name */}
                    <div className="bg-card border border-border/40 p-5 rounded-4xl flex items-center gap-4 transition-all hover:border-border/80">
                        <div className="p-3 bg-primary/5 text-primary rounded-2xl shrink-0">
                            <User size={18} strokeWidth={1.5} />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">
                                Last Name
                            </p>
                            {renderInputField('lastName', 'text', userData?.lastName, 'e.g. Dela Cruz', 'lastName')}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="bg-card border border-border/40 p-5 rounded-4xl flex items-center gap-4 transition-all hover:border-border/80">
                        <div className="p-3 bg-primary/5 text-primary rounded-2xl shrink-0">
                            <Calendar size={18} strokeWidth={1.5} />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">
                                Date of Birth
                            </p>
                            {renderInputField('dob', 'date', userData?.dob, '', 'dob')}
                        </div>
                    </div>

                    {/* Gender */}
                    <div className="bg-card border border-border/40 p-5 rounded-4xl flex items-center gap-4 transition-all hover:border-border/80">
                        <div className="p-3 bg-primary/5 text-primary rounded-2xl shrink-0">
                            <VenusAndMars size={18} strokeWidth={1.5} />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">
                                Gender
                            </p>
                            {isEditing ? (
                                <select
                                    value={userData?.gender || ''}
                                    onChange={(e) => onInputChange('gender', e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary transition-colors mt-0.5"
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            ) : (
                                <p className="text-sm font-semibold text-foreground wrap-break-word">
                                    {userData?.gender || 'Not set'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="bg-card border border-border/40 p-5 rounded-4xl flex items-center gap-4 transition-all hover:border-border/80 md:col-span-2">
                        <div className="p-3 bg-primary/5 text-primary rounded-2xl shrink-0">
                            <Mail size={18} strokeWidth={1.5} />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">
                                Email Address
                            </p>
                            {renderInputField('email', 'email', userData?.email, 'example@mail.com', 'email')}
                        </div>
                    </div>

                </div>
            </div>

            {/* SECTION: BIOMETRICS & HEALTH */}
            <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-5 ml-2">
                    Biometrics & Health
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    
                    {/* Blood Type */}
                    <div className="bg-card border border-border/40 p-5 rounded-4xl flex items-center gap-4 transition-all hover:border-border/80">
                        <div className="p-3 bg-red-500/5 text-red-600 rounded-2xl shrink-0">
                            <Droplets size={18} strokeWidth={1.5} />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">
                                Blood Type
                            </p>
                            {isEditing ? (
                                <select
                                    value={userData?.bloodType || ''}
                                    onChange={(e) => onInputChange('bloodType', e.target.value)}
                                    className="w-full bg-background border border-border rounded-xl px-2 py-1.5 text-sm font-black text-foreground focus:outline-none focus:border-primary transition-colors mt-0.5"
                                >
                                    <option value="">--</option>
                                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            ) : (
                                <p className="text-sm font-black text-red-600">
                                    {userData?.bloodType || 'Not set'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Height */}
                    <div className="bg-card border border-border/40 p-5 rounded-4xl flex items-center gap-4 transition-all hover:border-border/80">
                        <div className="p-3 bg-primary/5 text-primary rounded-2xl shrink-0">
                            <Ruler size={18} strokeWidth={1.5} />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">
                                Height
                            </p>
                            {isEditing ? (
                                <div className="flex items-center gap-1 mt-0.5">
                                    <input
                                        type="number"
                                        value={userData?.height || ''}
                                        placeholder="0"
                                        onChange={(e) => onInputChange('height', e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <span className="text-xs font-bold text-muted-foreground">cm</span>
                                </div>
                            ) : (
                                <p className="text-sm font-semibold text-foreground">
                                    {userData?.height ? `${userData.height} cm` : 'Not set'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Weight */}
                    <div className="bg-card border border-border/40 p-5 rounded-4xl flex items-center gap-4 transition-all hover:border-border/80">
                        <div className="p-3 bg-primary/5 text-primary rounded-2xl shrink-0">
                            <Scale size={18} strokeWidth={1.5} />
                        </div>
                        <div className="text-left min-w-0 flex-1">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">
                                Weight
                            </p>
                            {isEditing ? (
                                <div className="flex items-center gap-1 mt-0.5">
                                    <input
                                        type="number"
                                        value={userData?.weight || ''}
                                        placeholder="0"
                                        onChange={(e) => onInputChange('weight', e.target.value)}
                                        className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <span className="text-xs font-bold text-muted-foreground">kg</span>
                                </div>
                            ) : (
                                <p className="text-sm font-semibold text-foreground">
                                    {userData?.weight ? `${userData.weight} kg` : 'Not set'}
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* SECTION: LOCATION */}
            <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-5 ml-2">
                    Location
                </h3>
                <div className="bg-card border border-border/40 p-5 rounded-4xl flex items-center gap-4 transition-all hover:border-border/80">
                    <div className="p-3 bg-primary/5 text-primary rounded-2xl shrink-0">
                        <MapPin size={18} strokeWidth={1.5} />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black mb-1">
                            Full Address
                        </p>
                        {isEditing ? (
                            <textarea
                                value={userData?.address || ''}
                                placeholder="Enter your full address..."
                                onChange={(e) => onInputChange('address', e.target.value)}
                                rows={2}
                                className="w-full bg-background border border-border rounded-xl px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:border-primary transition-colors mt-0.5 resize-none leading-relaxed"
                            />
                        ) : (
                            <p className="text-sm font-semibold text-foreground wrap-break-word leading-relaxed">
                                {userData?.address || 'Not set'}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonalInfo;