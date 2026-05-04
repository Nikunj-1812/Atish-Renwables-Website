const { sendSuccess, sendError } = require('../utils/apiResponse');

const services = [
  {
    id: 1,
    title: 'Turnkey Solar EPC Services',
    description:
      'Complete end-to-end solar power plant execution with integrated engineering, procurement, and commissioning for industrial, commercial, and residential projects.',
  },
  {
    id: 2,
    title: 'EPC Solutions for Renewable Energy Projects',
    description:
      'Specialized engineering and project management for utility-scale and distributed renewable energy installations with transparent cost and timeline delivery.',
  },
  {
    id: 3,
    title: 'Solar Feasibility Study & Site Assessment',
    description:
      'Comprehensive on-site evaluation covering solar potential, shading analysis, structural assessment, and economic viability for informed project planning.',
  },
  {
    id: 4,
    title: 'Solar Design and Engineering Services',
    description:
      'Custom system design optimized for energy yield, grid compliance, and structural safety with detailed technical specifications and compliance documentation.',
  },
  {
    id: 5,
    title: 'Procurement Services',
    description:
      'Strategic sourcing and procurement of quality solar equipment, inverters, balance-of-system components with supplier management and warranty coordination.',
  },
  {
    id: 6,
    title: 'Construction Management',
    description:
      'Professional project management covering site coordination, quality assurance, safety protocols, and timely execution of installation and commissioning.',
  },
  {
    id: 7,
    title: 'Solar Plant Operation and Maintenance',
    description:
      'Scheduled preventive maintenance, performance optimization, and corrective services to ensure peak system efficiency and longevity.',
  },
  {
    id: 8,
    title: 'Solar Performance Monitoring and Reporting',
    description:
      'Real-time monitoring dashboards, performance analytics, and detailed monthly/annual reports to track system health and energy production.',
  },
  {
    id: 9,
    title: 'Training and Support',
    description:
      'Comprehensive operator training, troubleshooting guides, technical support, and regular maintenance workshops for long-term system reliability.',
  },
  {
    id: 10,
    title: 'Customized Turnkey Solar Solutions',
    description:
      'Tailored solar solutions designed to meet specific project requirements, regulatory compliance, and financial objectives for maximum ROI.',
  },
];

const getServices = async (req, res) => {
  try {
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Services fetched successfully.',
      data: {
        services,
      },
    });
  } catch (error) {
    return sendError(res, {
      statusCode: 500,
      message: error.message || 'Failed to fetch services.',
      errors: error.message ? [error.message] : undefined,
    });
  }
};

module.exports = {
  getServices,
};