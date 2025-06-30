import { saveSound } from './sounds';
import { supabase } from './supabase';

export const uploadSoundAndGetUrl = async ({ blob, fileName }) => {
  const { error: uploadError } = await supabase.storage
    .from('chorimixer')
    .upload(fileName, blob, {
      contentType: 'audio/mpeg',
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: publicUrlData, error: urlError } = supabase.storage
    .from('chorimixer')
    .getPublicUrl(fileName);

  if (urlError) throw urlError;

  return publicUrlData.publicUrl;
};

export const procesarYGuardarSonido = async ({ title, type, file, user }) => {
  const response = await fetch(file.uri);
  const blob = await response.blob();
  const fileName = `${Date.now()}_${file.name || 'micrec.mp3'}`;

  const publicUrl = await uploadSoundAndGetUrl({ blob, fileName });

  const sonidoGuardado = await saveSound({
    title,
    type,
    url: publicUrl,
    user,
  });

  return sonidoGuardado;
};
