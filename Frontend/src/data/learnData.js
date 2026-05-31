// src/data/learnData.js
import { 
    Heart, Stethoscope, Pill, Apple, Dumbbell, Brain, 
    Activity, ShieldCheck, AlertTriangle, Baby 
} from 'lucide-react';

export const learnData = {
    // 1. General Health
    "introduction-to-anatomy": {
        title: "Introduction to Anatomy",
        category: "Foundational Medicine",
        categorySlug: "general-health",
        duration: "15 min read",
        icon: "Heart",
        description: "A comprehensive baseline overview of human structural systems, organic internal frameworks, and interactive biological baselines.",
        overview: "Understanding the layout of the human body is fundamental to baseline medical knowledge. This module covers the primary organ networks, structural parameters, and systemic physiological interactions that sustain human homeostasis under varying external conditions.",
        sections: [
            {
                heading: "1. The Cardiovascular Blueprint",
                content: "The cardiovascular ecosystem relies heavily on synchronized kinetic pressure profiles to distribute localized oxygenation vectors. The heart functions as a biological central pump, utilizing alternating systolic and diastolic cycles to push blood through an intricate vascular network spanning over 60,000 miles of arteries, arterioles, capillaries, and veins."
            },
            {
                heading: "2. Neurological Signaling Arrays",
                content: "Our neural architecture acts as a low-latency network utilizing complex electro-chemical transitions to process sensory inputs. Synaptic connections fire via action potentials utilizing neurotransmitters like acetylcholine and glutamate to coordinate voluntary muscular contractions and involuntary autonomic responses seamlessly."
            },
            {
                heading: "3. Musculoskeletal Integration",
                content: "The human skeleton provides an internal structural scaffolding consisting of 206 bones in an adult organism, connected via complex ligaments and tendons. Skeletal muscles cross these bony articulations, converting metabolic energy from adenosine triphosphate into structural kinetic force and movement."
            },
            {
                heading: "4. Homeostasis and Regulatory Feedback",
                content: "Homeostasis refers to the dynamic maintenance of a stable internal environment despite variable external fluctuations. Biological regulatory systems utilize negative feedback loops to stabilize internal body temperature, blood pH levels, glucose concentrations, and fluid osmolarity profiles."
            }
        ]
    },

    // 2. Symptoms
    "symptoms-evaluation-framework": {
        title: "Symptom Evaluation Framework",
        category: "Clinical Assessment",
        categorySlug: "symptoms",
        duration: "14 min read",
        icon: "Stethoscope",
        description: "Learn how healthcare professionals differentiate between acute, subacute, and chronic symptoms using structural diagnostic matrices.",
        overview: "An effective medical response begins with systemic evaluation. This module provides baseline criteria for mapping symptom timelines, localized pain scaling, clinical history taking, and identifying secondary physiological red flags.",
        sections: [
            {
                heading: "1. Categorizing Onset Timelines",
                content: "Symptoms are structurally partitioned by their presentation speed and clinical duration. Acute manifestations emerge rapidly over minutes to hours, signaling immediate tissue stress or cellular ischemia, whereas subacute and chronic profiles present slow micro-adjustments over several weeks or months."
            },
            {
                heading: "2. Pain Characterization Models",
                content: "Clinical pain evaluation demands an analytical approach to subjective patient data. Practitioners separate nociceptive pain—caused by direct localized tissue damage—from neuropathic pain, which arises from central or peripheral nerve lesions and presents as burning or electric sensations."
            },
            {
                heading: "3. Constitutional Signs and Micro-Symptoms",
                content: "Constitutional signs include systemic clinical features such as unexplained pyrexia (fever), rapid diaphoresis (sweating), and cachexia (unintentional weight loss). These indicators typically reflect systemic immune responses, underlying localized infections, or metabolic disruptions."
            },
            {
                heading: "4. Red Flag Indicators",
                content: "Certain symptom configurations mandate immediate emergency medical overrides. These clinical red flags include unexplained syncopal episodes, progressive neurological deficits, sudden crushing retrosternal pressure, or severe muscular rigidity that fails to respond to positional changes."
            }
        ]
    },

    // 3. Medications
    "pharmacology-basics": {
        title: "Pharmacology Basics",
        category: "Clinical Therapeutics",
        categorySlug: "medications",
        duration: "18 min read",
        icon: "Pill",
        description: "An analytical breakdown of chemical classifications, drug-receptor interactions, and pharmacokinetic delivery systems.",
        overview: "This section explores how active chemical compounds alter complex physiological pathways. It introduces fundamental pharmacological vocabulary across absorption rates, compound half-lives, bio-availability scores, and toxicological metabolic thresholds.",
        sections: [
            {
                heading: "1. Pharmacokinetics Demystified",
                content: "Pharmacokinetics deals entirely with how a biological system handles a foreign compound over time. It explicitly maps the ADME pipeline: Absorption through cellular membranes, Distribution via blood plasma, Metabolic conversion primarily through hepatic cytochrome P450 enzymes, and eventual Excretion via renal filtration."
            },
            {
                heading: "2. Pharmacodynamics and Receptor Kinetics",
                content: "Pharmacodynamics investigates what a chemical compound does to a living organism. Active molecules target surface or intracellular receptors, acting as full agonists that trigger biological cascades, partial agonists, or competitive antagonists that structurally block native ligands from binding."
            },
            {
                heading: "3. Bioavailability and Route Optimization",
                content: "Bioavailability represents the percentage of an administered drug dose that reaches systemic circulation completely unchanged. Intravenous administration provides immediate 100% bioavailability, whereas oral paths encounter the hepatic first-pass metabolism, which significantly degrades active compounds before systemic entry."
            },
            {
                heading: "4. Therapeutic Index and Safety Profiling",
                content: "The Therapeutic Index (TI) is the quantitative ratio comparing the drug concentration that causes toxicity to the concentration that yields a therapeutic effect. Medications with a narrow therapeutic index require precise blood monitoring to stay within safe therapeutic margins."
            }
        ]
    },

    // 4. Nutrition
    "macronutrients-and-metabolism": {
        title: "Macronutrients and Metabolism",
        category: "Nutritional Science",
        categorySlug: "nutrition",
        duration: "13 min read",
        icon: "Apple",
        description: "A clinical exploration of dietary substrates, biochemical pathways, and hormonal regulation of energy storage.",
        overview: "Nutrition bridges biochemical processes with everyday physical performance. This module analyzes how your digestive and metabolic systems convert carbohydrates, proteins, and lipids into functional adenosine triphosphate (ATP) molecules.",
        sections: [
            {
                heading: "1. Metabolic Pathways of Glucose",
                content: "Carbohydrates undergo glycolytic processes within cellular cytoplasm to generate pyruvate and usable cellular fuels. Excess systemic glucose signals the immediate upregulation of insulin from pancreatic beta cells, triggering glycogen synthesis within hepatic and skeletal storage centers."
            },
            {
                heading: "2. Amino Acid Architecture",
                content: "Proteins serve as crucial molecular structures for baseline organic repair. Dietary proteins are broken down into amino acids, which are then used by ribosomes during translation to create muscular fibers, structural collagen, critical hormone networks, and cellular immunological defenses."
            },
            {
                heading: "3. Lipid Metabolism and Transport",
                content: "Lipids represent dense biological energy storages, providing structural components for cellular lipid bilayers. Triglycerides are broken down into free fatty acids via beta-oxidation inside the mitochondria, generating significant amounts of ATP while being transported in blood plasma using hydrophobic lipoprotein packages like LDL and HDL."
            },
            {
                heading: "4. Micronutrient Co-Factors",
                content: "Vitamins and minerals serve as essential co-enzymes and structural elements within broader biochemical frameworks. For instance, iron complexes are essential inside the hemoglobin matrix to hold oxygen, while B-complex vitamins act as necessary catalysts within the citric acid cycle."
            }
        ]
    },

    // 5. Exercise
    "exercise-physiology-fundamentals": {
        title: "Exercise Physiology Fundamentals",
        category: "Kinesiology",
        categorySlug: "exercise",
        duration: "15 min read",
        icon: "Dumbbell",
        description: "An overview of skeletal muscular adaptations, aerobic thresholds, and the biomechanical stresses of progressive loading.",
        overview: "Physical exertion triggers intense adaptive transformations throughout your anatomical structures. This module discusses cardiorespiratory output modifications, capillary density shifts, and cellular energy adaptations during variable exercise strains.",
        sections: [
            {
                heading: "1. Aerobic vs. Anaerobic Energy Pathways",
                content: "Sub-maximal cardiorespiratory training leverages efficient mitochondrial oxygen processing via oxidative phosphorylation. As exertion levels spike past anaerobic thresholds, the muscular environment relies on fast glycolysis, yielding rapid ATP alongside localized lactate and hydrogen ion accumulations."
            },
            {
                heading: "2. Hypertrophy and Myofibrillar Repair",
                content: "High-tension mechanical overload forces structural micro-tears into skeletal muscle fibers. During recovery periods, satellite cells donate nuclei to damaged areas, triggering protein synthesis that accumulates thicker actin and myosin chains to scale up force potential."
            },
            {
                heading: "3. Cardiovascular Training Responses",
                content: "Chronic physical training expands cardiac stroke volume over time, increasing ventricular chamber size and elasticity. This long-term adaptation decreases baseline resting heart rate (bradycardia) while maintaining optimal blood pressure profiles."
            },
            {
                heading: "4. Neuromuscular Adaptations",
                content: "Early strength gains in exercise routines stem primarily from neural coordination shifts before physical hypertrophy occurs. The central nervous system improves motor unit recruitment patterns, firing frequencies, and inter-muscular synchronization to optimize movement patterns."
            }
        ]
    },

    // 6. Mental Health
    "neurobiology-of-stress": {
        title: "The Neurobiology of Stress",
        category: "Psychiatry & Behavioral Science",
        categorySlug: "mental-health",
        duration: "16 min read",
        icon: "Brain",
        description: "A look inside the hypothalamic-pituitary-adrenal (HPA) axis, neurological chemistry, and clinical cognitive frameworks.",
        overview: "Psychological well-being is closely tied to systemic physical reactions. This guide analyzes how chronic psychological stressors disrupt neurological chemistry balances, alter neural pathways, and affect overall systemic immune responses.",
        sections: [
            {
                heading: "1. The HPA Axis Response Loop",
                content: "Perceived threats signal the amygdala to activate neural stress responses, bypassing conscious logic. This triggers the hypothalamus to release corticotropin-releasing hormone (CRH), stimulating the pituitary and adrenal glands to dump cortisol and epinephrine into blood circulation, which accelerates heart pacing and shifts focus away from resting metabolic actions."
            },
            {
                heading: "2. Neurotransmitter Balance Profiles",
                content: "Serotonin, dopamine, gamma-aminobutyric acid (GABA), and norepinephrine coordinate emotional processing arrays. Sustained high cortisol levels slowly desensitize these neurotransmitter receptor sites, contributing to the development of mood disorders and heightened generalized anxiety states."
            },
            {
                heading: "3. Neuroplasticity and Cortical Remodeling",
                content: "Chronic stress states inhibit normal neurogenesis within the hippocampus—the brain's primary memory consolidation region. Conversely, it over-stimulates dendritic branches inside the amygdala, keeping the organism trapped in a state of high threat-vigilance."
            },
            {
                heading: "4. Cognitive Behavioral Interventions",
                content: "Evidence-based psychotherapies focus on interrupting these automated neural threat loops. By consciously re-framing cognitive distortions, patients can strengthen structural prefrontal cortex controls, effectively dialing down autonomic nervous system hyper-reactivity."
            }
        ]
    },

    // 7. Chronic Conditions
    "managing-insulin-resistance": {
        title: "Managing Insulin Resistance",
        category: "Endocrinology",
        categorySlug: "chronic-conditions",
        duration: "16 min read",
        icon: "Activity",
        description: "An examination of long-term cellular adaptation, vascular complications, and endocrine stabilization strategies.",
        overview: "Chronic endocrine conditions require persistent systemic adjustments. This overview examines cellular pathomechanics where receptors reject normal glucose pathways, leading to elevated vascular stress and long-term diagnostic risks.",
        sections: [
            {
                heading: "1. Cellular Reception Malfunctions",
                content: "Prolonged over-exposure to high nutrient concentrations causes insulin receptor substrates on cellular walls to slowly dull down. In response, the pancreas continuously elevates insulin production to clear glucose from the bloodstream, placing extreme stress on specialized islet cells over time."
            },
            {
                heading: "2. Microvascular and Macrovascular Pathology",
                content: "Sustained high circulatory glucose counts cause advanced glycation end-products (AGEs) to form along vascular walls. This damages the fine endothelial linings of vessels, increasing risks for nephropathy in renal systems, retinopathy in ocular structures, and atherogenesis inside primary coronary arteries."
            },
            {
                heading: "3. Metabolic Syndrome Clustering",
                content: "Insulin resistance rarely manifests in isolation; it sits at the center of Metabolic Syndrome. This diagnostic cluster links visceral abdominal obesity, systemic hypertension, elevated fasting triglycerides, and depleted HDL cholesterol counts, dramatically compounding cardiovascular event probabilities."
            },
            {
                heading: "4. Therapeutic Stabilization Strategies",
                content: "Clinical interventions center on restoring peripheral insulin sensitivity. This includes restricting high-glycemic carbohydrates, implementing regular muscle contractions to pull glucose from the blood without relying on insulin, and prescribing insulin-sensitizing medications like metformin."
            }
        ]
    },

    // 8. Preventive Care
    "immunological-memory-and-vaccines": {
        title: "Immunological Memory & Vaccines",
        category: "Immunology",
        categorySlug: "preventive-care",
        duration: "14 min read",
        icon: "ShieldCheck",
        description: "Understanding how adaptive defense systems record pathogens and the preventative mechanics behind immunization arrays.",
        overview: "Preventative medicine forms the baseline barrier for global healthcare infrastructure. This section unpacks how the human adaptive immune system records structural patterns of deactivated pathogens to shield against full future exposures.",
        sections: [
            {
                heading: "1. B-Cell and T-Cell Coordination",
                content: "Initial pathogen contact activates specialized adaptive defensive layers. Helper T-cells identify foreign antigens and activate B-lymphocytes, which rapidly differentiate into plasma cells to manufacture targeted antibodies, while a subset morphs into memory cells that preserve accurate structural blueprints of the target antigen for decades."
            },
            {
                heading: "2. Mechanisms of Immunization",
                content: "Vaccine delivery systems present safe, non-replicating variants or fragments of a pathogen to the host immune system. Modern mRNA platforms provide genetic instructions for cells to transiently manufacture harmless viral surface proteins, training the body's immune defenses without introducing live viral matter."
            },
            {
                heading: "3. Primary vs. Secondary Immune Response",
                content: "The primary immune response following initial antigen exposure is slow and moderate, requiring up to two weeks to produce peak antibody titers. Upon re-exposure, the waiting memory cells trigger an immediate secondary response, flooding circulation with neutralizing antibodies within hours to prevent disease development."
            },
            {
                heading: "4. Herd Immunity Thresholds",
                content: "When a critical volume of a community maintains high antibody preparation, transmission vectors are structurally cut off. This indirect population-level shield protects fragile, non-immunized individuals—such as newborns or severely immunosuppressed patients—from encountering pathogen sources."
            }
        ]
    },

    // 9. Emergency Care
    "triage-and-first-aid-protocols": {
        title: "Triage & First Aid Protocols",
        category: "Emergency Medicine",
        categorySlug: "emergency-care",
        duration: "15 min read",
        icon: "AlertTriangle",
        description: "Immediate response mechanics for managing critical airway blocks, severe hemorrhages, and life-saving systemic steps.",
        overview: "In critical scenarios, swift, orderly decision-making saves lives. This module details the international clinical protocols for maintaining systemic circulation, managing trauma, and identifying severe medical states under extreme pressure.",
        sections: [
            {
                heading: "1. Primary Airway Assessment and Restoration",
                content: "If an airway obstruction occurs, systemic oxygen saturation levels decline rapidly, risking brain damage within four minutes. Emergency responders deploy the head-tilt/chin-lift method or jaw-thrust maneuvers to clear soft tissue blocks, followed by the Heimlich maneuver or direct suctioning if foreign object blockages are present."
            },
            {
                heading: "2. Hemorrhage Control and Hemodynamics",
                content: "Severe arterial hemorrhaging can lead to hypovolemic shock and cardiac arrest within minutes. Responders apply continuous, firm direct pressure over the injury site using sterile dressings, upgrading to high-pressure arterial tourniquets applied proximal to the wound if initial attempts fail to control blood loss."
            },
            {
                heading: "3. Cardiopulmonary Resuscitation (CPR) Metrics",
                content: "When a victim suffers sudden cardiac arrest, external manual compressions are required to maintain minimal cerebral perfusion. Standard medical protocols demand a compression depth of 2 to 2.4 inches at a strict frequency of 100 to 120 beats per minute, minimizing pauses between chest compression sets."
            },
            {
                heading: "4. Shock Identification and Positioning",
                content: "Circulatory shock develops when the cardiovascular system fails to properly oxygenate vital tissues. Clinical indicators include cold, clammy skin, rapid thready pulses, shallow respirations, and altered mental status. Management requires keeping the patient warm, supine, and elevating their lower limbs to improve blood return to the heart."
            }
        ]
    },

    // 10. Pediatric Basics
    "developmental-milestones-in-infancy": {
        title: "Developmental Milestones in Infancy",
        category: "Pediatrics",
        categorySlug: "pediatric",
        duration: "14 min read",
        icon: "Baby",
        description: "Tracking neurological growth curves, early motor skill milestones, and infantile baseline care matrices.",
        overview: "Pediatric physiology and neurology change rapidly during early developmental phases. This framework provides quantitative metrics for observing early motor skill progression, language acquisition, cognitive stages, and infant baseline care steps.",
        sections: [
            {
                heading: "1. Cephalocaudal Motor Skill Progression",
                content: "Infant physical motor progression moves in a strict cephalocaudal (head-to-toe) and proximodistal (center-outward) pattern. Central muscle control develops first, allowing the infant to stabilize and lift their head before developing trunk stability to sit upright, eventually leading to complex finger-pincer grasps."
            },
            {
                heading: "2. Neurodevelopmental Reflex Integration",
                content: "Newborns are born with primitive survival reflexes—such as the Moro reflex, rooting reflex, and asymmetric tonic neck reflex. As higher cortical brain centers develop during the first year, these involuntary reflexes disappear, making way for voluntary, coordinated movements."
            },
            {
                heading: "3. Cognitive and Social Milestones",
                content: "Social milestones serve as early indicators of healthy neurological and cognitive mapping. Infants typically display a social smile by 2 months, develop babbling vocalizations by 6 months, and begin demonstrating stranger anxiety and object permanence by 9 months of age."
            },
            {
                heading: "4. Pediatric Immunology Timelines",
                content: "Newborn immune defenses depend largely on passive maternal antibodies transferred through the placenta and breastmilk. Since this temporary shield tapers off during the first 6 months, pediatric healthcare relies on structured preventative immunization schedules to train the infant's adaptive defenses against severe pathogens."
            }
        ]
    }
};