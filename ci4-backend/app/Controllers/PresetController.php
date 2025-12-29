<?php

namespace App\Controllers;

use App\Models\PresetModel;
use App\Models\PresetImageModel;
use CodeIgniter\RESTful\ResourceController;

class PresetController extends ResourceController
{
    protected $modelName = 'App\Models\PresetModel';
    protected $format    = 'json';

    /**
     * List all presets
     */
    public function index()
    {
        $presets = $this->model->findAll();
        $imageModel = new PresetImageModel();

        foreach ($presets as &$preset) {
            $preset['images'] = $imageModel->where('preset_id', $preset['id'])->findAll();
        }

        return $this->respond([
            'status' => 200,
            'data'   => $presets
        ]);
    }

    /**
     * Show single preset
     */
    public function show($id = null)
    {
        $preset = $this->model->find($id);
        if (!$preset) {
            return $this->failNotFound('Preset not found');
        }

        $imageModel = new PresetImageModel();
        $preset['images'] = $imageModel->where('preset_id', $preset['id'])->findAll();

        return $this->respond([
            'status' => 200,
            'data'   => $preset
        ]);
    }

    /**
     * Create new preset
     */
    public function create()
    {
        $data = $this->request->getPost();
        
        $data['created_by']  = session()->get('id') ?? 1;
        $data['is_featured'] = $data['is_featured'] ?? 0;

        if (!$this->model->insert($data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        $presetId = $this->model->getInsertID();
        $files = $this->request->getFiles();
        $uploadedImages = [];
        $firstImagePath = null;

        if ($files && isset($files['images'])) {
            $imageModel = new PresetImageModel();
            foreach ($files['images'] as $img) {
                if ($img->isValid() && !$img->hasMoved()) {
                    if (str_starts_with($img->getClientMimeType(), 'image/')) {
                        $newName = $img->getRandomName();
                        $img->move(FCPATH . 'uploads/presets', $newName);
                        
                        $imagePath = 'uploads/presets/' . $newName;
                        if (!$firstImagePath) $firstImagePath = $imagePath;

                        $imageModel->insert([
                            'preset_id' => $presetId,
                            'path'      => $imagePath,
                            'filename'  => $newName,
                            'mimetype'  => $img->getClientMimeType()
                        ]);
                        
                        $uploadedImages[] = [
                            'filename' => $newName,
                            'url'      => base_url($imagePath)
                        ];
                    }
                }
            }
        }

        // If a drive_link wasn't manually provided, use the first image path
        if (empty($data['drive_link']) && $firstImagePath) {
            $this->model->update($presetId, ['drive_link' => $firstImagePath]);
        }

        return $this->respondCreated([
            'status'  => 201,
            'message' => 'Preset created successfully',
            'data'    => [
                'id'     => $presetId,
                'preset' => $this->model->find($presetId),
                'images' => $uploadedImages
            ]
        ]);
    }

    /**
     * Upload more images to an existing preset
     */
    public function uploadImages($id = null)
    {
        $preset = $this->model->find($id);
        if (!$preset) {
            return $this->failNotFound('Preset not found');
        }

        $files = $this->request->getFiles();
        if (!$files || !isset($files['images'])) {
            return $this->fail('No images provided');
        }

        $imageModel = new PresetImageModel();
        $uploadedCount = 0;

        foreach ($files['images'] as $img) {
            if ($img->isValid() && !$img->hasMoved()) {
                if (str_starts_with($img->getClientMimeType(), 'image/')) {
                    $newName = $img->getRandomName();
                    $img->move(FCPATH . 'uploads/presets', $newName);

                    $imageModel->insert([
                        'preset_id' => $id,
                        'path'      => 'uploads/presets/' . $newName,
                        'filename'  => $newName,
                        'mimetype'  => $img->getClientMimeType()
                    ]);
                    $uploadedCount++;
                }
            }
        }

        return $this->respond([
            'status'  => 200,
            'message' => "$uploadedCount images uploaded successfully",
            'data'    => $imageModel->where('preset_id', $id)->findAll()
        ]);
    }

    /**
     * Delete a specific image
     */
    public function deleteImage($imageId = null)
    {
        $imageModel = new PresetImageModel();
        $image = $imageModel->find($imageId);

        if (!$image) {
            return $this->failNotFound('Image not found');
        }

        // Delete from filesystem
        $filePath = FCPATH . 'uploads/presets/' . $image['filename'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $imageModel->delete($imageId);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Image deleted successfully'
        ]);
    }

    /**
     * Update preset
     */
    public function update($id = null)
    {
        $preset = $this->model->find($id);
        if (!$preset) {
            return $this->failNotFound('Preset not found');
        }

        // Handle JSON or Form input
        $data = $this->request->getJSON(true) ?: $this->request->getRawInput();
        
        if (!$this->model->update($id, $data)) {
            return $this->failValidationErrors($this->model->errors());
        }

        return $this->respond([
            'status'  => 200,
            'message' => 'Preset updated successfully'
        ]);
    }

    /**
     * Delete preset
     */
    public function delete($id = null)
    {
        $preset = $this->model->find($id);
        if (!$preset) {
            return $this->failNotFound('Preset not found');
        }

        $imageModel = new PresetImageModel();
        $images = $imageModel->where('preset_id', $id)->findAll();
        foreach ($images as $img) {
            $path = FCPATH . 'uploads/presets/' . $img['filename'];
            if (file_exists($path)) {
                unlink($path);
            }
        }

        $imageModel->where('preset_id', $id)->delete();
        $this->model->delete($id);

        return $this->respondDeleted([
            'status'  => 200,
            'message' => 'Preset and its associated images deleted successfully'
        ]);
    }
}
