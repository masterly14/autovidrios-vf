import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const withLazyAnimation = (WrappedComponent: React.ComponentType<any>) => {
  return function WithLazyAnimation(props: any) {
    const [ref, inView] = useInView({
      triggerOnce: true,
      threshold: 0.1,
    });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        <WrappedComponent {...props} />
      </motion.div>
    );
  };
};

export default withLazyAnimation;

