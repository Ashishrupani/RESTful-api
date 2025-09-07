import { motion } from "framer-motion";

const HomePage = () => {

  const greet = ()=> {console.log(":)")};
  return (
    <>
      <div className="bg-transparent absolute top-0 w-full h-14 rounded-md">
        <div className="flex flex-row gap-20">
          <motion.div
            className="flex justify-center items-center py-3 mx-10 text-gray-200 text-xl"
            animate={{ scale: 1 }}
            whileInView={{ opacity: 1 }}
          >
            <motion.button
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.5 },
              }}
              whileTap={{ scale: 0.9 }}
              onClick={greet}
            >
              RESTful-API
            </motion.button>
          </motion.div>

          <motion.div
            className="flex justify-center items-center py-3 mx-10 text-gray-200 text-xl gap-5"
            animate={{ scale: 1 }}
            whileInView={{ opacity: 1 }}
          >
            <motion.button
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.5 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              Home
            </motion.button>

            <motion.button
              whileHover={{
                scale: 1.2,
                transition: { duration: 0.5 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              About
            </motion.button>

            
          </motion.div>
        </div>
      </div>
      <motion.div></motion.div>
    </>
  );
};

export default HomePage;
