import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export default function ServiceList({ services, selectedService, setSelectedService }: {services: any, selectedService: any, setSelectedService: any}) {
  return (
    <motion.div
      className="w-full md:w-1/3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {services.map((service: any, index: number) => (
        <motion.div
          key={index}
          className={`mb-4 p-4 rounded-lg cursor-pointer transition-colors ${
            selectedService === index
              ? "bg-[#1A2B5F] text-primary-foreground"
              : "bg-background hover:bg-primary/10"
          }`}
          variants={itemVariants}
          onClick={() => setSelectedService(index)}
        >
          <div className="flex items-center">
            {service.icon}
            <h3 className="ml-3 text-lg font-semibold">{service.title}</h3>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
