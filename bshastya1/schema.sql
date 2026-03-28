-- ============================================================
-- Shastya AI — MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS shastya_ai;
USE shastya_ai;

-- ------------------------------------------------------------
-- patients
-- ------------------------------------------------------------
CREATE TABLE patients (
  id            VARCHAR(36)  NOT NULL PRIMARY KEY,
  uhid          VARCHAR(16)  NOT NULL UNIQUE,
  full_name     VARCHAR(120) NOT NULL,
  age           TINYINT UNSIGNED NOT NULL,
  gender        ENUM('male','female','other') NOT NULL,
  blood_group   VARCHAR(4),
  phone         VARCHAR(20),
  conditions    JSON         NOT NULL DEFAULT ('[]'),
  medications   JSON         NOT NULL DEFAULT ('[]'),
  risk_level    ENUM('low','medium','high','critical') NOT NULL DEFAULT 'low',
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- vitals  (time-series, multiple rows per patient)
-- ------------------------------------------------------------
CREATE TABLE vitals (
  id               VARCHAR(36)    NOT NULL PRIMARY KEY,
  patient_id       VARCHAR(36)    NOT NULL,
  recorded_at      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  heart_rate       TINYINT UNSIGNED,          -- bpm
  blood_pressure_sys SMALLINT UNSIGNED,       -- mmHg systolic
  blood_pressure_dia SMALLINT UNSIGNED,       -- mmHg diastolic
  glucose          SMALLINT UNSIGNED,         -- mg/dL
  spo2             TINYINT UNSIGNED,          -- %
  weight           DECIMAL(5,1),             -- lbs
  temperature      DECIMAL(4,1),             -- °F
  CONSTRAINT fk_vitals_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  INDEX idx_vitals_patient_time (patient_id, recorded_at DESC)
);

-- ------------------------------------------------------------
-- alerts
-- ------------------------------------------------------------
CREATE TABLE alerts (
  id          VARCHAR(36)  NOT NULL PRIMARY KEY,
  patient_id  VARCHAR(36)  NOT NULL,
  risk_level  ENUM('low','medium','high','critical') NOT NULL,
  category    VARCHAR(60),
  message     TEXT         NOT NULL,
  is_read     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_alerts_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  INDEX idx_alerts_patient (patient_id, created_at DESC)
);

-- ------------------------------------------------------------
-- ai_predictions  (stores cached model outputs)
-- ------------------------------------------------------------
CREATE TABLE ai_predictions (
  id              VARCHAR(36)  NOT NULL PRIMARY KEY,
  patient_id      VARCHAR(36)  NOT NULL,
  model_type      ENUM('rnn_vitals','cnn_imaging','llm_summary') NOT NULL,
  risk            ENUM('Low','Moderate','High','Critical') NOT NULL,
  confidence      TINYINT UNSIGNED NOT NULL,   -- 0–100
  insight         TEXT         NOT NULL,
  recommendation  TEXT         NOT NULL,
  raw_payload     JSON,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pred_patient FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  INDEX idx_pred_patient_time (patient_id, created_at DESC)
);
