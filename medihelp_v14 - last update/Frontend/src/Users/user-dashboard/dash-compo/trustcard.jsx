import { ShieldCheck, Lock, Code2, Users, CheckCircle2, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustSignals = () => {
    const signals = [
        { 
            icon: <GraduationCap size={24} />, // Palitan ang ShieldCheck ng GraduationCap
            label: "Research-Based", 
            sub: "Academic Project", 
            color: "text-emerald-500", 
            bg: "bg-emerald-500/10" 
        },
        { 
            icon: <Lock size={24} />, 
            label: "AES-256", 
            sub: "Data Secured", // Mas bagay ang 'Data Secured' kaysa 'Encrypted' para sa general users
            color: "text-blue-500", 
            bg: "bg-blue-500/10" 
        },
        { 
            icon: <Code2 size={24} />, // Palitan ang Star
            label: "v1.0 Beta", 
            sub: "In Development", 
            color: "text-amber-500", 
            bg: "bg-amber-500/10" 
        },
        { 
            icon: <Users size={24} />, 
            label: "CvSU-Imus", 
            sub: "BSIT PROJECT", 
            color: "text-indigo-500", 
            bg: "bg-indigo-500/10" 
        }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 relative overflow-hidden"
        >
            {/* Background Glows for Depth */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-24 bg-primary/5 blur-[100px] pointer-events-none" />
            
            <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-[40px] p-10 relative z-10">
                <div className="text-center space-y-10">
                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.4em] mb-2">
                            <CheckCircle2 size={14} /> Trust & Compliance
                        </div>
                        <h4 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
                            Trusted Healthcare <span className="text-primary">Guidance.</span>
                        </h4>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {signals.map((signal, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex flex-col items-center space-y-4 group"
                            >
                                <div className={`w-16 h-16 ${signal.bg} ${signal.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    {signal.icon}
                                </div>
                                <div className="space-y-1 text-center">
                                    <p className="text-[13px] font-black uppercase italic tracking-tight text-foreground">
                                        {signal.label}
                                    </p>
                                    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground opacity-60">
                                        {signal.sub}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Security Disclaimer */}
                    <div className="pt-8 border-t border-border/40">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed opacity-50 max-w-2xl mx-auto">
                            MediHelp is a student research prototype committed to data privacy. We implement industry-standard security practices and encryption to ensure that your health information is handled with care and academic integrity.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TrustSignals;