import React, { useState } from 'react';
import { SPECIES_PROFILES, SpeciesId } from '../data/species';

interface SpeciesPortraitProps {
  species: SpeciesId;
  className?: string;
}

export const SpeciesPortrait: React.FC<SpeciesPortraitProps> = ({ species, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const sp = SPECIES_PROFILES[species];

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-600 font-semibold text-sm select-none ${className}`}
        aria-label={`Ilustração clínica de ${sp.name}`}
      >
        {sp.name}
      </div>
    );
  }

  return (
    <img
      src={sp.imageUrl}
      alt={`Ilustração científica veterinária de ${sp.name} (${sp.scientificName})`}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover bg-[#F8FAFC] ${className}`}
    />
  );
};
