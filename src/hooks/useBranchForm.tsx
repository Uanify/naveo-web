
import { useState, useEffect } from "react";
import { BranchFormData } from "@/types/branch";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDebounce } from "use-debounce";

export interface BranchFormProps {
  initialData: Partial<BranchFormData>;
}

export function useBranchForm({ initialData }: BranchFormProps) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BranchFormData>({
    name: "",
    phone: "",
    street: "",
    ext_number: "",
    int_number: "",
    neighborhood: "",
    city: "",
    zip_code: "",
    state: "",
    country: "",
    lat: 0,
    lng: 0,
    ...initialData,
  });

  const isEditing = !!initialData.id;

  // Search state
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);

  // Handle Photon Search
  useEffect(() => {
    if (debouncedSearch.length < 3) {
      setResults([]);
      return;
    }

    const fetchPhoton = async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(
            debouncedSearch
          )}&limit=5`
        );
        const data = await res.json();
        setResults(data.features || []);
        setShowResults(true);
      } catch (error) {
        console.error("Photon search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchPhoton();
  }, [debouncedSearch]);

  const handleLocationUpdate = (data: Partial<BranchFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSelectResult = (feature: any) => {
    const [lng, lat] = feature.geometry.coordinates;
    const properties = feature.properties;

    const locationData: Partial<BranchFormData> = {
      lat,
      lng,
      street: properties.street || properties.name || "",
      ext_number: properties.housenumber || "",
      neighborhood: properties.district || properties.suburb || "",
      city: properties.city || properties.town || "",
      zip_code: properties.postcode || "",
      state: properties.state || "",
      country: properties.country || "",
    };

    handleLocationUpdate(locationData);
    setSearch(properties.name || properties.street || "");
    setShowResults(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Only need company_id for creation, but good to check generally
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", user?.id)
        .single();

      if (!profile?.company_id) {
        throw new Error("No se encontró ID de la compañía");
      }

      const payload = {
        name: formData.name,
        phone: formData.phone,
        street: formData.street,
        ext_number: formData.ext_number,
        int_number: formData.int_number,
        neighborhood: formData.neighborhood,
        city: formData.city,
        zip_code: formData.zip_code,
        state: formData.state,
        country: formData.country,
        lat: formData.lat,
        lng: formData.lng,
        company_id: profile.company_id,
        full_address: `${formData.street} ${formData.ext_number}, ${formData.neighborhood}, ${formData.city}`,
      };

      if (isEditing && formData.id) {
        const { error } = await supabase
          .from("branches")
          .update(payload)
          .eq("id", formData.id);

        if (error) throw error;
        toast.success("Sucursal actualizada con éxito");
      } else {
        const { error } = await supabase.from("branches").insert(payload);

        if (error) throw error;
        toast.success("Sucursal creada con éxito");
      }

      router.push("/branches");
      router.refresh();
    } catch (error: any) {
      console.error("Error saving branch:", error);
      toast.error(error.message || "Error al guardar la sucursal");
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    handleSelectResult,
    handleLocationUpdate,
    search,
    setSearch,
    results,
    isSearching,
    showResults,
    setShowResults,
    loading,
    router,
    isEditing,
  };
}
