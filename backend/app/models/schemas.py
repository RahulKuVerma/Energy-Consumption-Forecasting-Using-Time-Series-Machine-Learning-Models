from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Dataset Schemas ---
class DatasetBase(BaseModel):
    name: str
    filename: str
    row_count: int
    sampling_rate: Optional[str] = "1 Hour"
    start_timestamp: Optional[str] = None
    end_timestamp: Optional[str] = None
    status: Optional[str] = "processed"

class DatasetCreate(DatasetBase):
    file_path: str
    file_size_bytes: int = 0

class DatasetResponse(DatasetBase):
    id: int
    file_path: str
    file_size_bytes: int
    created_at: str

# --- Reading Schemas ---
class EnergyReadingItem(BaseModel):
    id: Optional[int] = None
    dataset_id: Optional[int] = None
    timestamp: str
    global_active_power: float
    global_reactive_power: Optional[float] = 0.0
    voltage: Optional[float] = 230.0
    global_intensity: Optional[float] = 0.0
    sub_metering_1: Optional[float] = 0.0
    sub_metering_2: Optional[float] = 0.0
    sub_metering_3: Optional[float] = 0.0
    total_consumption_kwh: Optional[float] = 0.0

class ReadingsQueryResponse(BaseModel):
    total_count: int
    page: int
    page_size: int
    readings: List[EnergyReadingItem]

# --- Model Schemas ---
class MLModelResponse(BaseModel):
    id: int
    name: str
    model_type: str
    version: str
    mae: Optional[float] = None
    rmse: Optional[float] = None
    mape: Optional[float] = None
    r2_score: Optional[float] = None
    hyperparameters: Optional[Dict[str, Any]] = None
    is_active: bool
    trained_at: Optional[str] = None

# --- Forecast Schemas ---
class ForecastRequest(BaseModel):
    dataset_id: Optional[int] = None
    model_name: str = "xgboost"  # 'linear_regression', 'xgboost', 'lstm'
    horizon_hours: int = 24
    granularity: str = "hourly"

class ForecastItem(BaseModel):
    timestamp: str
    predicted_value: float
    lower_bound: Optional[float] = None
    upper_bound: Optional[float] = None
    actual_value: Optional[float] = None

class ForecastResponse(BaseModel):
    forecast_id: int
    model_name: str
    horizon_hours: int
    granularity: str
    mean_forecast: float
    peak_forecast: float
    min_forecast: float
    total_energy_kwh: float
    metrics_summary: Optional[Dict[str, Any]] = None
    forecast_items: List[ForecastItem]
    created_at: str

# --- Analytics Schemas ---
class SubmeteringBreakdown(BaseModel):
    kitchen_kwh: float
    laundry_kwh: float
    climate_kwh: float
    other_kwh: float

class AnalyticsSummaryResponse(BaseModel):
    total_consumption_kwh: float
    avg_hourly_kw: float
    peak_demand_kw: float
    peak_timestamp: Optional[str] = None
    estimated_cost: float
    estimated_co2_kg: float
    submetering: SubmeteringBreakdown
    daily_trend: List[Dict[str, Any]]
    hourly_profile: List[Dict[str, Any]]

# --- Alert Schemas ---
class AlertItem(BaseModel):
    id: int
    alert_type: str
    severity: str
    title: str
    message: str
    metric_name: str
    actual_value: Optional[float] = None
    threshold_value: Optional[float] = None
    timestamp: str
    is_resolved: bool
    created_at: str

class AlertCreate(BaseModel):
    alert_type: str
    severity: str
    title: str
    message: str
    metric_name: str = "global_active_power"
    actual_value: float
    threshold_value: float
    timestamp: Optional[str] = None

# --- System Settings Schemas ---
class SystemSettingItem(BaseModel):
    key: str
    value: str
    description: Optional[str] = None
    updated_at: Optional[str] = None
