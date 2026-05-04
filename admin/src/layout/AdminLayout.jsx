import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen lg:flex">
      <Sidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Topbar />

        <motion.div
          className="mt-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          {children}
        </motion.div>
      </main>
    </div>
  );
}
