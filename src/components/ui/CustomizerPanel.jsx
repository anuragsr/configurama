import React, { useState } from 'react';
import { useConfigStore } from '../../store/useConfigStore';
import {
  FABRICS,
  COLOR_PALETTES,
  SKIN_TONES,
  SHOE_VARIANTS,
  CATEGORIES,
} from '../../data/apparelRegistry';
import { HuePicker } from 'react-color';
import { Palette, Check, Layers, ChevronRight, ChevronLeft, User, HatGlasses, Shirt, SportShoe } from 'lucide-react';

const CATEGORY_ICON_COMPONENTS = { User, HatGlasses, Shirt, SportShoe };

const iconForCategory = (categoryId) => {
  const cat = CATEGORIES.find((c) => c.id === categoryId);
  return CATEGORY_ICON_COMPONENTS[cat?.icon] || User;
};

export const CustomizerPanel = () => {
  const {
    activeCategory,
    setActiveCategory,
    slots,
    activePart,
    setActivePart,
    setPartColor,
    setSlotFabric,
    setSlotVariant,
    skinTone,
    setSkinTone,
  } = useConfigStore();

  const [customColorPickerOpen, setCustomColorPickerOpen] = useState(false);
  const [selectedSlotKey, setSelectedSlotKey] = useState(null);

  // Only shown in the detail view (the Overview screen's own cards handle
  // navigation there) - a single way back, since there's nothing else on
  // that screen to jump categories with.
  const categorySwitcher = (
    <div className="category-switcher">
      <button
        type="button"
        className="category-switcher-item"
        onClick={() => setActiveCategory('all')}
      >
        <ChevronLeft size={16} />
        <span>Back to Overview</span>
      </button>
    </div>
  );

  // If in 'all' view, show overview of all active garments + skin tone picker
  if (activeCategory === 'all') {
    return (
      <div className="customizer-panel overview-mode">
        <div className="panel-header">
          <div className="panel-title-group">
            <h3>Outfit & Model Overview</h3>
            <span className="panel-subtitle">Select any garment or skin tone</span>
          </div>
        </div>

        <div className="slots-overview-list">

          {/* Skin Tone Selector Card */}
          <div className="section-block" style={{ padding: '0 4px 10px 4px' }}>
            <div className="section-title-row" style={{ marginBottom: '8px' }}>
              <label className="section-title">Mannequin Skin Tone</label>
            </div>
            <div className="color-swatches-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {SKIN_TONES.map((tone) => {
                const isSelected = skinTone === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    className={`swatch-btn ${isSelected ? 'active' : ''}`}
                    style={{ backgroundColor: tone.hex }}
                    title={tone.name}
                    onClick={() => setSkinTone(tone.id)}
                  >
                    {isSelected && (
                      <Check
                        size={14}
                        color={['fair', 'warm_beige', 'tan', 'mannequin_matte'].includes(tone.id) ? '#18181b' : '#ffffff'}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Garment Cards */}
          {Object.entries(slots).map(([slotKey, slot]) => {
            const IconComponent = iconForCategory(slot.category);
            return (
              <div
                key={slotKey}
                className={`slot-card ${slot.enabled ? 'enabled' : 'disabled'}`}
                onClick={() => setActiveCategory(slot.category)}
              >
                <div className="slot-card-header">
                  <div className="slot-info">
                    <h4>
                      <IconComponent size={15} className="slot-title-icon" />
                      {slot.name}
                    </h4>
                    <span className="slot-fabric-badge">{slot.fabric}</span>
                  </div>
                </div>

                {/* Color previews of parts */}
                <div className="slot-parts-preview">
                  {Object.entries(slot.parts).map(([pKey, pVal]) => (
                    <div key={pKey} className="part-swatch-chip" title={`${pVal.label}: ${pVal.color}`}>
                      <span
                        className="swatch-dot"
                        style={{ backgroundColor: pVal.color }}
                      />
                      <span className="part-label">{pVal.label}</span>
                    </div>
                  ))}
                </div>

                <div className="slot-card-footer">
                  <span>Customize</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const categorySlotEntries = Object.entries(slots).filter(
    ([, s]) => s.category === activeCategory
  );
  const slotKey =
    selectedSlotKey && categorySlotEntries.some(([k]) => k === selectedSlotKey)
      ? selectedSlotKey
      : categorySlotEntries[0]?.[0];
  const currentSlot = slots[slotKey];

  if (!currentSlot) return null;

  const currentPartKey = currentSlot.parts[activePart] ? activePart : Object.keys(currentSlot.parts)[0];
  const activePartData = currentSlot.parts[currentPartKey] || { label: 'Part', color: '#ffffff' };

  return (
    <div className="customizer-panel">
      {categorySwitcher}

      {/* Garment Header */}
      <div className="panel-header">
        <div className="panel-title-group">
          <h3>{currentSlot.name}</h3>
          <span className="panel-subtitle">Category: {currentSlot.category}</span>
        </div>
      </div>

      {categorySlotEntries.length > 1 && (
        <div className="section-block">
          <label className="section-title">Select Garment</label>
          <div className="parts-pill-grid">
            {categorySlotEntries.map(([gKey, gSlot]) => {
              const isSelected = slotKey === gKey;
              return (
                <button
                  key={gKey}
                  type="button"
                  className={`part-pill-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedSlotKey(gKey);
                    setActivePart(Object.keys(gSlot.parts)[0]);
                  }}
                >
                  <span className="part-pill-text">{gSlot.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {currentSlot.enabled && currentSlot.variant !== undefined && (
        <div className="customizer-content">
          {/* Shoe Style Picker - click to swap the model shown, no color options */}
          <div className="section-block">
            <label className="section-title">Select Shoe Style</label>
            <div className="fabric-options-grid">
              {SHOE_VARIANTS.map((variant) => {
                const isSelected = currentSlot.variant === variant.id;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    className={`fabric-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSlotVariant(slotKey, variant.id)}
                  >
                    <span className="fabric-name">{variant.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {currentSlot.enabled && currentSlot.variant === undefined && (
        <div className="customizer-content">
          {/* Sub-parts tabs */}
          <div className="section-block">
            <label className="section-title">Select Garment Part</label>
            <div className="parts-pill-grid">
              {Object.entries(currentSlot.parts).map(([pKey, pVal]) => {
                const isSelected = currentPartKey === pKey;
                return (
                  <button
                    key={pKey}
                    type="button"
                    className={`part-pill-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setActivePart(pKey)}
                  >
                    <span
                      className="part-pill-color-indicator"
                      style={{ backgroundColor: pVal.color }}
                    />
                    <span className="part-pill-text">{pVal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palettes & Picker */}
          <div className="section-block">
            <div className="section-title-row">
              <label className="section-title">
                Color for <span className="highlight-part">{activePartData.label}</span>
              </label>
              <span className="color-hex-value">{activePartData.color.toUpperCase()}</span>
            </div>

            {/* Quick Color Swatches */}
            <div className="color-swatches-grid">
              {COLOR_PALETTES.map((palette) => {
                const isMatching = activePartData.color.toLowerCase() === palette.hex.toLowerCase();
                return (
                  <button
                    key={palette.name}
                    type="button"
                    className={`swatch-btn ${isMatching ? 'active' : ''}`}
                    style={{ backgroundColor: palette.hex }}
                    title={`${palette.name} (${palette.hex})`}
                    onClick={() => setPartColor(slotKey, currentPartKey, palette.hex)}
                  >
                    {isMatching && (
                      <Check
                        size={14}
                        color={['#ffffff', '#fafafa', '#f4f4f5', '#d4b996', '#f59e0b', '#84cc16', '#06b6d4'].includes(palette.hex.toLowerCase()) ? '#18181b' : '#ffffff'}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Hue Slider Picker */}
            <div className="custom-hue-picker-container">
              <div className="hue-label-row">
                <span>Fine-tune Hue Spectrum</span>
              </div>
              <HuePicker
                width="100%"
                color={activePartData.color}
                onChangeComplete={(color) => setPartColor(slotKey, currentPartKey, color.hex)}
              />
            </div>
          </div>

          {/* Fabric Material Selection */}
          <div className="section-block">
            <label className="section-title">Fabric Material</label>
            <div className="fabric-options-grid">
              {FABRICS.map((fabric) => {
                const isSelected = currentSlot.fabric === fabric.id;
                return (
                  <button
                    key={fabric.id}
                    type="button"
                    className={`fabric-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSlotFabric(slotKey, fabric.id)}
                  >
                    <span className="fabric-name">{fabric.name}</span>
                    <span className="fabric-specs">Roughness: {fabric.roughness}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
