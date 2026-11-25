/**
 * @file climate.ts
 * @description Centralized climate, emission factors, and atmospheric constants for AIRWISE.
 * Grounded in IPCC 2021 AR6 Transport Metrics and WHO 2021 Global Air Quality Guidelines.
 */

/**
 * Transport emission factors in kg CO2e per passenger-kilometer (IPCC 2021 AR6 urban transit).
 */
export const EMISSION_FACTORS = {
  /** Internal combustion engine personal car */
  SOLO_CAR_KG_CO2E_PER_KM: 0.192,
  /** Two-wheeler motorized motorcycle/scooter */
  MOTORCYCLE_KG_CO2E_PER_KM: 0.084,
  /** Municipal diesel/CNG bus */
  BUS_KG_CO2E_PER_KM: 0.068,
  /** Electric urban rail/metro system */
  ELECTRIC_METRO_KG_CO2E_PER_KM: 0.028,
  /** Walking or manual bicycle */
  ACTIVE_TRANSIT_KG_CO2E_PER_KM: 0.0,
} as const;

/**
 * Atmospheric baseline defaults for tropospheric calculations.
 */
export const ATMOSPHERIC_DEFAULTS = {
  /** Severe winter inversion default AQI */
  SEVERE_INVERSION_AQI_BASELINE: 284,
  /** Diurnal planetary boundary layer compression height in meters */
  BOUNDARY_LAYER_INVERSION_HEIGHT_M: 320,
  /** Standard urban residential indoor-to-outdoor particle infiltration ratio */
  RESIDENTIAL_INFILTRATION_RATIO: 0.65,
  /** WHO 2021 PM2.5 24-hour target threshold in ug/m3 */
  WHO_PM25_24H_TARGET_UG_M3: 15.0,
} as const;
